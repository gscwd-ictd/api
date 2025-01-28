import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeSchedule, CreateEmployeeScheduleDto, CreateEmployeeScheduleByGroupDto, DeleteEmployeeScheduleDto } from '@gscwd-api/models';
import { EmployeeDetails, EmployeeScheduleType, ScheduleType } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { CustomGroupMembersService } from '../../../../custom-groups/components/custom-group-members/core/custom-group-members.service';
import { EmployeeRestDaysService } from '../components/employee-rest-day/components/employee-rest-days/core/employee-rest-days.service';
import { EmployeeRestDayService } from '../components/employee-rest-day/core/employee-rest-day.service';

@Injectable()
export class EmployeeScheduleService extends CrudHelper<EmployeeSchedule> {
  constructor(
    private readonly crudService: CrudService<EmployeeSchedule>,
    private readonly employeeRestDayService: EmployeeRestDayService,
    private readonly employeeRestDaysService: EmployeeRestDaysService,
    private readonly client: MicroserviceClient,
    private readonly customGroupMembersService: CustomGroupMembersService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addEmployeeSchedule(employeeScheduleDto: CreateEmployeeScheduleDto) {
    const { restDays, dtrDates, employeeId, ...restOfEmployeeSchedules } = employeeScheduleDto;
    //#region 1. Create Employee Schedule
    const result = await this.dataSource.transaction(async (entityManager) => {
      let employeeSchedule: EmployeeSchedule;
      if (!Array.isArray(dtrDates)) {
        const { dateFrom, dateTo } = dtrDates as { dateFrom: Date; dateTo: Date };
        employeeSchedule = await this.crud()
          .transact<EmployeeSchedule>(entityManager)
          .create({
            dto: {
              ...restOfEmployeeSchedules,
              dateFrom,
              dateTo,
              employeeId,
            },
          });
        //#region 2. Set Rest Days
        const employeeRestDay = await this.employeeRestDayService.addEmployeeRestDayTransaction(
          {
            employeeId,
            dateFrom,
            dateTo,
            restDays,
          },
          entityManager
        );
        //#endregion 2. Set Rest Days
        return { ...employeeSchedule, employeeRestDay };
      } else {
        const arrayOfSchedulesAndRestDays = await Promise.all(
          dtrDates.map(async (dtrDate) => {
            employeeSchedule = await this.crud()
              .transact<EmployeeSchedule>(entityManager)
              .create({
                dto: { ...restOfEmployeeSchedules, dateFrom: dtrDate, dateTo: dtrDate, employeeId },
              });

            //#region 2. Set Rest Days
            const employeeRestDay = await this.employeeRestDayService.addEmployeeRestDayTransaction(
              {
                employeeId,
                dateFrom: dayjs(dtrDate).toDate(),
                dateTo: dayjs(dtrDate).toDate(),
                restDays,
              },
              entityManager
            );
            //#endregion 2. Set Rest Days
            return { ...employeeSchedule, employeeRestDay };
          })
        );
        return arrayOfSchedulesAndRestDays;
      }
      //#endregion 1. Create Employee Schedule
    });
    console.log(result);
    return result;
  }

  async addEmployeeScheduleByGroup(employeeScheduleByGroupDto: CreateEmployeeScheduleByGroupDto) {
    const { dateFrom, dateTo, scheduleId, customGroupId, employees } = employeeScheduleByGroupDto;
    const employeeSchedules = await Promise.all(
      employees.map(async (employee) => {
        return await this.addEmployeeSchedule({
          dateFrom,
          dateTo,
          scheduleId,
          customGroupId,
          employeeId: employee.employeeId,
          restDays: employee.restDays,
        });
      })
    );
    return employeeSchedules;
  }

  async getEmployeeDetailsByCompanyId(companyId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: companyId,
      pattern: 'get_employee_details_by_company_id',
      onError: (error) => new NotFoundException(error),
    })) as EmployeeDetails;

    return employeeDetails;
  }

  async getAllEmployeeSchedules(employeeId: string) {
    try {
      const schedule = await this.rawQuery<string, EmployeeScheduleType[]>(
        `
      SELECT DISTINCT 
          s.schedule_id id,
          es.date_from esDateFrom,
          es.date_to esDateTo,
          s.name scheduleName, 
          s.schedule_type scheduleType, 
          s.time_in timeIn,
          s.lunch_out lunchOut,
          s.lunch_in lunchIn, 
          s.time_out timeOut, 
          s.shift shift,
          s.schedule_base scheduleBase,
          DATE_FORMAT(emr.date_from,'%Y-%m-%d') dateFrom,
          DATE_FORMAT(emr.date_to,'%Y-%m-%d') dateTo,
          concat(DATE_FORMAT(emr.date_from,'%Y-%m-%d'),'-',DATE_FORMAT(emr.date_to,'%Y-%m-%d')) scheduleRange,
          GROUP_CONCAT(emrs.rest_day SEPARATOR ', ') restDaysNumbers,
          GROUP_CONCAT(get_weekday((emrs.rest_day - 1)) SEPARATOR ', ') restDaysNames 
      FROM employee_schedule es 
      INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
      LEFT JOIN employee_rest_day emr ON emr.employee_id_fk = es.employee_id_fk 
      INNER JOIN employee_rest_days emrs ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk  
      WHERE emr.employee_id_fk = ? AND emr.date_from = es.date_from AND emr.date_to = es.date_to 
      GROUP BY s.schedule_id,es.created_at,emr.employee_rest_day_id,scheduleRange 
      ORDER BY DATE_FORMAT(emr.date_from,'%Y-%m-%d') DESC;`,
        [employeeId]
      );

      const convertedSchedule = await Promise.all(
        schedule.map(async (scheduleItem) => {
          const { restDaysNumbers, ...rest } = scheduleItem;
          const _restDays = restDaysNumbers.split(',');
          const convertedRestDays = await Promise.all(
            _restDays.map(async (_restDay) => {
              return parseInt(_restDay);
            })
          );
          return { restDays: convertedRestDays, ...rest };
        })
      );
      return convertedSchedule;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getEmployeeScheduleByDtrDate(employeeId: string, dtrDate: Date) {
    const currDate = dayjs(dtrDate);
    const currDateString = currDate.toDate().getFullYear() + '-' + (currDate.toDate().getMonth() + 1).toString() + '-' + currDate.toDate().getDate();

    const employeeName = (await this.client.call<string, string, { fullName: string }>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_name',
      onError: (error) => new NotFoundException(error),
    })) as { fullName: string };

    try {
      const schedule = (
        await this.rawQuery<string, EmployeeScheduleType>(
          `
    SELECT DISTINCT 
        s.schedule_id id,
        es.date_from esDateFrom,
        es.date_to esDateTo,
        s.name scheduleName, 
        s.schedule_type scheduleType, 
        s.time_in timeIn,
        s.lunch_out lunchOut,
        s.lunch_in lunchIn, 
        s.time_out timeOut, 
        s.shift shift,
        s.schedule_base scheduleBase,
        IF(s.is_with_lunch = 1,'true','false') withLunch,
        DATE_FORMAT(emr.date_from,'%Y-%m-%d') dateFrom,
        DATE_FORMAT(emr.date_to,'%Y-%m-%d') dateTo,
        concat(DATE_FORMAT(emr.date_from,'%Y-%m-%d'),'-',DATE_FORMAT(emr.date_to,'%Y-%m-%d')) scheduleRange,
        GROUP_CONCAT(emrs.rest_day SEPARATOR ', ') restDaysNumbers,
        GROUP_CONCAT(get_weekday((emrs.rest_day - 1)) SEPARATOR ', ') restDaysNames 
    FROM employee_schedule es 
    INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
    LEFT JOIN employee_rest_day emr ON emr.employee_id_fk = es.employee_id_fk 
    INNER JOIN employee_rest_days emrs ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk  
    WHERE emr.employee_id_fk = ? AND ( ? BETWEEN emr.date_from AND emr.date_to ) AND ( ? BETWEEN es.date_from AND es.date_to ) 
    GROUP BY s.schedule_id,es.created_at,dateFrom, dateTo,scheduleRange,es.date_from,es.date_to ORDER BY DATE_FORMAT(es.date_from,'%Y-%m-%d') DESC, DATE_FORMAT(es.date_to,'%Y-%m-%d') DESC,DATE_FORMAT(emr.date_from,'%Y-%m-%d') DESC LIMIT 1`,
          [employeeId, currDateString, currDateString]
        )
      )[0];
      const { withLunch, ...restSchedule } = schedule;
      return { employeeName: employeeName.fullName, schedule: { withLunch: withLunch === 'true' ? true : false, ...restSchedule } };
    } catch (error) {
      return { employeeName: employeeName.fullName, schedule: { restDaysNumbers: '' } };
    }
  }

  async getEmployeeScheduleByScheduleId(employeeId: string, scheduleId: string, dtrDate: Date) {
    try {
      const currDate = dayjs(dtrDate).toDate();

      const currDateString = currDate.getFullYear() + '-' + (currDate.getMonth() + 1).toString() + '-' + currDate.getDate();

      const employeeName = (await this.client.call<string, string, { fullName: string }>({
        action: 'send',
        payload: employeeId,
        pattern: 'get_employee_name',
        onError: (error) => new NotFoundException(error),
      })) as { fullName: string };

      const schedule = (
        await this.rawQuery<string, EmployeeScheduleType>(
          `
    SELECT DISTINCT 
        es.created_at createdAt,
        es.date_from esDateFrom,
        es.date_to esDateTo,
        s.schedule_id id,
        s.name scheduleName, 
        s.schedule_type scheduleType, 
        s.time_in timeIn,
        s.lunch_out lunchOut,
        s.lunch_in lunchIn, 
        s.time_out timeOut, 
        s.shift shift,
        s.schedule_base scheduleBase,
        s.is_with_lunch withLunch,
        DATE_FORMAT(emr.date_from,'%Y-%m-%d') dateFrom,
        DATE_FORMAT(emr.date_to,'%Y-%m-%d') dateTo,
        concat(DATE_FORMAT(emr.date_from,'%Y-%m-%d'),'-',DATE_FORMAT(emr.date_to,'%Y-%m-%d')) scheduleRange,
        GROUP_CONCAT(emrs.rest_day SEPARATOR ', ') restDaysNumbers,
        GROUP_CONCAT(get_weekday((emrs.rest_day - 1)) SEPARATOR ', ') restDaysNames 
    FROM employee_schedule es 
    INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
    LEFT JOIN employee_rest_day emr ON emr.employee_id_fk = es.employee_id_fk 
    INNER JOIN employee_rest_days emrs ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk  
    WHERE s.schedule_id = ? AND ( ? BETWEEN emr.date_from AND emr.date_to ) AND ( ? BETWEEN es.date_from AND es.date_to ) 
    GROUP BY s.schedule_id,es.created_at,dateFrom,dateTo,scheduleRange,es.date_from,es.date_to ORDER BY DATE_FORMAT(es.date_from,'%Y-%m-%d') DESC, 
    DATE_FORMAT(es.date_to,'%Y-%m-%d') ASC LIMIT 1`,
          [scheduleId, currDateString, currDateString]
        )
      )[0];
      return { employeeName: employeeName.fullName, schedule: { ...schedule } };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getEmployeeSchedule(employeeId: string) {
    try {
      const employeeName = (await this.client.call<string, string, { fullName: string }>({
        action: 'send',
        payload: employeeId,
        pattern: 'get_employee_name',
        onError: (error) => new NotFoundException(error),
      })) as { fullName: string };

      const schedule = (
        await this.rawQuery<
          string,
          {
            id: string;
            scheduleName: string;
            scheduleType: ScheduleType;
            timeIn: string;
            lunchOut: string;
            lunchIn: string;
            timeOut: string;
            scheduleBase: string;
            restDaysNumbers: string;
            restDaysNames: string;
          }
        >(
          `SELECT 
          s.schedule_id id,
          s.name scheduleName, 
          s.schedule_type scheduleType, 
          s.time_in timeIn,
          s.lunch_out lunchOut,
          s.lunch_in lunchIn, 
          s.time_out timeOut, 
          s.shift shift,
          s.schedule_base scheduleBase,
          DATE_FORMAT(emr.date_from,'%Y-%m-%d') dateFrom,
          DATE_FORMAT(emr.date_to,'%Y-%m-%d') dateTo,
          GROUP_CONCAT(emrs.rest_day SEPARATOR ', ') restDaysNumbers,
          GROUP_CONCAT(get_weekday((emrs.rest_day - 1)) SEPARATOR ', ') restDaysNames 
      FROM employee_schedule es 
      INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
      LEFT JOIN employee_rest_day emr ON emr.employee_id_fk = es.employee_id_fk 
      INNER JOIN employee_rest_days emrs ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk  
      WHERE emr.employee_id_fk = ? GROUP BY s.schedule_id,es.created_at,dateFrom,dateTo ORDER BY DATE_FORMAT(emr.date_from,'%Y-%m-%d') DESC LIMIT 1`,
          [employeeId]
        )
      )[0];

      return { employeeName: employeeName.fullName, schedule: { ...schedule } };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteEmployeeSchedule(employeeScheduleDto: DeleteEmployeeScheduleDto) {
    const { employeeId, dateFrom, dateTo } = employeeScheduleDto;

    const restDay = await this.employeeRestDayService.crud().findOne({ find: { select: { id: true }, where: { employeeId, dateFrom, dateTo } } });

    const restDaysDelete = await this.employeeRestDaysService.crud().delete({ deleteBy: { employeeRestDayId: restDay }, softDelete: false });

    const restDayDelete = await this.employeeRestDayService.crud().delete({ deleteBy: { id: restDay.id }, softDelete: false });
    const deleteSchedule = await this.crud().delete({
      deleteBy: { dateFrom, dateTo, employeeId },
      softDelete: false,
    });

    if (deleteSchedule.affected > 0) return { employeeScheduleDto, restDay };
    return restDay;
  }

  async getEmployeeScheduleByGroupId(customGroupId: string) {
    return customGroupId;
  }
}
