import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Holidays, HolidaysDto, UpdateHolidayDto } from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { LeaveAddBackService } from '../../leave/components/leave-add-back/core/leave-add-back.service';
import { LeaveApplicationDatesService } from '../../leave/components/leave-application-dates/core/leave-application-dates.service';
import { LeaveCardLedgerCreditService } from '../../leave/components/leave-card-ledger-credit/core/leave-card-ledger-credit.service';

@Injectable()
export class HolidaysService extends CrudHelper<Holidays> {
  constructor(
    private readonly crudService: CrudService<Holidays>,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async getHolidaysForTheCurrentYear() {
    return await this.rawQuery(
      `SELECT holiday_id id, 
              name, 
              date_format(holiday_date,'%M %d, %Y') holidayDate, 
              type FROM holidays 
      WHERE year(holiday_date) = year(now()) 
      ORDER BY holiday_date ASC`
    );
  }

  @Cron('0 0 0 1 1 *')
  async addRegularHolidaysForCurrentYear() {
    const holidays = (await this.rawQuery(`
      SELECT 
          name,
          type, 
          date_format(holiday_date,'%M %d, %Y') holidayDate  
          FROM holidays 
      WHERE year(holiday_date) = year(now())-1 AND type='regular' 
      ORDER BY holiday_date ASC`)) as Holidays[];

    const currentHolidays = await Promise.all(
      holidays.map(async (holiday) => {
        //return '';
        const { holidayDate, id, ...rest } = holiday;
        await this.crudService.create({
          dto: {
            holidayDate: dayjs(holidayDate).add(1, 'year').toDate(),
            ...rest,
          },
          onError: () => new InternalServerErrorException(),
        });
      })
    );
    console.log('regular holidays added for the year');
  }

  async getLastWeekDayOfTheMonth(dateString: string) {
    const theDate = dayjs(dateString);
    const lastDayOfMonth = dayjs(theDate.format('YYYY-MM') + '-' + theDate.daysInMonth());
    const lastDayOfMonthDayOfWeek = lastDayOfMonth.day();
    let lastWeekDayOfMonth = lastDayOfMonth;
    if (lastDayOfMonthDayOfWeek === 6) lastWeekDayOfMonth = lastDayOfMonth.subtract(1, 'day');
    if (lastDayOfMonthDayOfWeek === 0) lastWeekDayOfMonth = lastDayOfMonth.subtract(2, 'day');
    return lastWeekDayOfMonth.toDate();
  }

  async getTheNextWorkingDayByDays(date: Date, days: number) {
    const theDate = dayjs(date);
    let currDate = theDate;
    if (days === 1) return currDate.add(1, 'day');
    for (let i = 1; i <= days; i++) {
      if (currDate.day() === 6) {
        currDate = currDate.add(2, 'day');
      } else if (currDate.day() === 0 || (await this.isHoliday(dayjs(currDate.format('YYYY-MM-DD')).toDate()))) {
        currDate = currDate.add(1, 'day');
      } else {
        currDate = currDate.add(1, 'day');
      }

      if (i === days && days > 1) {
        if (currDate.day() === 6) {
          currDate = currDate.add(2, 'day');
        } else {
          currDate = currDate.add(1, 'day');
          while ((await this.isHoliday(dayjs(currDate.format('YYYY-MM-DD')).toDate())) || currDate.day() === 0 || currDate.day() === 6) {
            currDate = currDate.add(1, 'day');
          }
        }
      }
    }
    return currDate.toDate();
  }

  async addBackFromHoliday(holidayDate: Date) {
    const holiday = await this.crudService.findOneOrNull({ find: { where: { holidayDate } } });
    console.log(holiday);
    if (holiday) {
      const { holidayDate, name, type } = holiday;
      console.log(holidayDate);

      const reason = 'Holiday - ' + type + ' - ' + name;
      //add back leave dates for the set holiday;
      //1. get all employeeIds na nasa leave application na may approved na application
      const employees = (await this.rawQuery(`
        SELECT DISTINCT employee_id_fk employeeId 
        FROM leave_application WHERE status='approved';`)) as {
        employeeId: string;
      }[];

      console.log(employees);

      //2. get all leaveApplicationDatesId galing sa number 1 na may leave application na tumama sa day nung holiday
      await this.rawQuery(
        `DELETE FROM employee_monitoring.leave_card_ledger_debit WHERE daily_time_record_id_fk IN 
        (SELECT daily_time_record_id FROM daily_time_record WHERE dtr_date = ?);`,
        [holidayDate]
      );
      const leaveAddBacks = await Promise.all(
        employees.map(async (employeeId) => {
          const leaveApplications = (await this.rawQuery(
            `
            SELECT leave_application_date_id leaveApplicationDateId 
              FROM leave_application_dates lad INNER JOIN leave_application la 
            WHERE la.leave_application_id = lad.leave_application_id_fk 
            AND la.employee_id_fk = ? AND leave_date = ? AND la.status = ?
          `,
            [employeeId.employeeId, holidayDate, LeaveApplicationStatus.APPROVED]
          )) as { leaveApplicationDateId: string }[];

          const leaveApplicationDates = await Promise.all(
            leaveApplications.map(async (leaveApplication) => {
              const { leaveApplicationDateId } = leaveApplication;
              const leaveApplicationDate = await this.leaveApplicationDatesService.crud().findOne({
                find: {
                  select: { createdAt: true, deletedAt: true, id: true, leaveDate: true, updatedAt: true },
                  where: { id: leaveApplicationDateId },
                },
              });
              const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
                const leaveAddBack = await this.leaveAddBackService.addLeaveAddBackTransaction(
                  {
                    creditValue: 1,
                    leaveApplicationDatesId: leaveApplicationDate,
                    reason,
                  },
                  entityManager
                );

                const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
                  {
                    leaveAddBackId: leaveAddBack,
                  },
                  entityManager
                );
              });
            })
          );
        })
      );
    }
  }

  async addHoliday(holidaysDto: HolidaysDto) {
    const holiday = await this.crudService.create({
      dto: holidaysDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    const { holidayDate, name, type } = holiday;

    const reason = 'Holiday - ' + type + ' - ' + name;
    //add back leave dates for the set holiday;
    //1. get all employeeIds na nasa leave application na may approved na application
    const employees = (await this.rawQuery(`SELECT DISTINCT employee_id_fk employeeId FROM leave_application WHERE status='approved';`)) as {
      employeeId: string;
    }[];

    //2. get all leaveApplicationDatesId galing sa number 1 na may leave application na tumama sa day nung holiday
    await this.rawQuery(
      `DELETE FROM employee_monitoring.leave_card_ledger_debit WHERE daily_time_record_id_fk IN 
        (SELECT daily_time_record_id FROM daily_time_record WHERE dtr_date = ?); `,
      [holidaysDto.holidayDate]
    );
    const leaveAddBacks = await Promise.all(
      employees.map(async (employeeId) => {
        const leaveApplications = (await this.rawQuery(
          `
            SELECT leave_application_date_id leaveApplicationDateId 
              FROM leave_application_dates lad INNER JOIN leave_application la 
            WHERE la.leave_application_id = lad.leave_application_id_fk 
            AND la.employee_id_fk = ? AND leave_date = ? AND la.status = ?
          `,
          [employeeId.employeeId, holidayDate, LeaveApplicationStatus.APPROVED]
        )) as { leaveApplicationDateId: string }[];

        const leaveApplicationDates = await Promise.all(
          leaveApplications.map(async (leaveApplication) => {
            const { leaveApplicationDateId } = leaveApplication;
            const leaveApplicationDate = await this.leaveApplicationDatesService.crud().findOne({
              find: {
                select: { createdAt: true, deletedAt: true, id: true, leaveDate: true, updatedAt: true },
                where: { id: leaveApplicationDateId },
              },
            });
            const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
              const leaveAddBack = await this.leaveAddBackService.addLeaveAddBackTransaction(
                {
                  creditValue: 1,
                  leaveApplicationDatesId: leaveApplicationDate,
                  reason,
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
                {
                  leaveAddBackId: leaveAddBack,
                },
                entityManager
              );
            });
          })
        );
      })
    );
    return holiday;
  }

  async getHoliday(id: string) {
    return await this.crudService.findOne({
      find: { where: { id } },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async getHolidayTypeByDate(holidayDate: Date) {
    const _holidayDate = dayjs(holidayDate).toDate();
    try {
      return (await this.crudService.findOneOrNull({ find: { select: { type: true }, where: { holidayDate: _holidayDate } } })).type;
    } catch {
      return null;
    }
  }

  async updateHoliday(updateHolidayDto: UpdateHolidayDto) {
    const { id, ...rest } = updateHolidayDto;
    const updateHolidayResult = await this.crudService.update({
      dto: rest,
      updateBy: { id },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (updateHolidayResult.affected > 0) return updateHolidayDto;
  }

  async deleteHoliday(id: string) {
    const holiday = await this.getHoliday(id);
    const deleteResult = await this.crudService.delete({
      deleteBy: { id },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (deleteResult.affected > 0) return holiday;
  }

  async isHoliday(day: Date) {
    try {
      const isHoliday = (await this.rawQuery(`SELECT IF(COUNT(*) > 0,TRUE,FALSE) isHoliday FROM holidays WHERE holiday_date = ?;`, [day]))[0]
        .isHoliday;
      if (isHoliday === '0') return false;
      return true;
    } catch (error) {
      Logger.log(error);
    }
  }
}
