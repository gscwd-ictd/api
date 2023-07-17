/* eslint-disable @typescript-eslint/no-empty-function */
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { DailyTimeRecord, UpdateDailyTimeRecordDto } from '@gscwd-api/models';
import { DtrPayload, IvmsEntry, ScheduleType, EmployeeScheduleType, MonthlyDtrItemType } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs = require('dayjs');
import { HolidaysService } from '../../holidays/core/holidays.service';
import { EmployeeScheduleService } from '../components/employee-schedule/core/employee-schedule.service';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<DailyTimeRecord> {
  constructor(
    private readonly crudService: CrudService<DailyTimeRecord>,
    private readonly client: MicroserviceClient,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly holidayService: HolidaysService
  ) {
    super(crudService);
  }

  async getAllDTR() {
    return await this.client.call({
      action: 'send',
      payload: {},
      pattern: 'get_all_records',
      onError: (error) => new NotFoundException(error),
    });
  }

  private getDayRange(numberOfDays: number) {
    switch (numberOfDays) {
      case 28:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
      case 29:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
      case 30:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      case 31:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
      default:
        return [9, 31];
    }
  }

  async getEmployeeDtrByMonthAndYear(companyId: string, year: number, month: number) {
    const daysInMonth = dayjs(year + '-' + month + '-' + '01').daysInMonth();

    const dayRange = this.getDayRange(daysInMonth);
    console.log('day range ', dayRange);

    //#region for map
    const dtrDays: MonthlyDtrItemType[] = (await Promise.all(
      dayRange.map(async (dtrDay, idx) => {
        //console.log('index ', dtrDay);

        const currDate = dayjs(year + '-' + month + '-' + dtrDay).toDate();
        const holidayType = await this.holidayService.getHolidayTypeByDate(currDate);

        try {
          const dtr = await this.getDtrByCompanyIdAndDay({ companyId, date: currDate });

          return { day: dayjs(currDate).format('YYYY-MM-DD'), holidayType, ...dtr };
        } catch {
          const currDate = dayjs(year + '-' + month + '-' + dtrDay).toDate();
          // #region rework get only id by company_id;
          const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(companyId);
          // #endregion
          const { remarks } = (await this.rawQuery(`SELECT get_dtr_remarks(?,?) remarks;`, [employeeDetails.userId, currDate]))[0];
          return {
            day: dayjs(currDate).format('YYYY-MM-DD'),
            holidayType,
            schedule: {
              id: null,
              lunchIn: null,
              esDateFrom: null,
              esDateTo: null,
              dateFrom: null,
              scheduleRange: null,
              dateTo: null,
              scheduleBase: null,
              lunchOut: null,
              restDaysNames: null,
              restDaysNumbers: null,
              schedule: null,
              scheduleName: null,
              scheduleType: null,
              shift: null,
              timeIn: null,
              timeOut: null,
            },
            dtr: {
              companyId: null,
              createdAt: null,
              deletedAt: null,
              dtrDate: null,
              id: null,
              lunchIn: null,
              lunchOut: null,
              timeIn: null,
              timeOut: null,
              updatedAt: null,
              remarks,
            },
            summary: {
              noOfLates: null,
              totalMinutesLate: null,
              noOfUndertimes: null,
              totalMinutesUndertime: null,
              isHalfDay: null,
            },
          };
        }
      })
    )) as MonthlyDtrItemType[];
    //#endregion map
    //console.log('from monthly ', dtrDays);
    const summary = await this.getSummary(dtrDays);
    console.log(summary);
    return { dtrDays, summary };
  }

  async getSummary(dtrDays: MonthlyDtrItemType[]) {
    //console.log(dtrDays);
    let noOfTimesLate = 0;
    let totalMinutesLate = 0;
    let lateDates: number[] = [];
    const summaryResult = await Promise.all(
      dtrDays.map(async (dtrDay: MonthlyDtrItemType) => {
        const { summary, dtr, day, holidayType, schedule } = dtrDay;
        noOfTimesLate += summary.noOfLates;
        totalMinutesLate += summary.totalMinutesLate;
        if (summary.noOfLates > 0) {
          const day = dayjs(dtr.dtrDate).date();
          lateDates.push(day);
        }
      })
    );
    return { noOfTimesLate, totalMinutesLate, lateDates };
  }

  //#region lates,undertimes,halfday functionalities

  async getLatesPerDay(dtr: DailyTimeRecord, schedule: EmployeeScheduleType) {
    //console.log('get lates per day', dtr, schedule);
    if (schedule.scheduleName === 'Regular Morning Schedule') {
      const lateMorning = dayjs(dayjs('2023-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm')).diff(
        dayjs('2023-01-01 ' + schedule.timeIn).format('YYYY-MM-DD HH:mm'),
        'm'
      );
      const lateAfternoon = dayjs(dayjs('2023-01-01 ' + dtr.lunchIn).format('YYYY-MM-DD HH:mm')).diff(
        dayjs('2023-01-01 13:00').format('YYYY-MM-DD HH:mm'),
        'm'
      );

      let minutesLate = 0;
      let noOfLates = 0;
      if (lateMorning > 0) {
        minutesLate += lateMorning;
        noOfLates += 1;
      }

      if (lateAfternoon > 0) {
        minutesLate += lateAfternoon;
        noOfLates += 1;
      }

      console.log({
        timeIn: dtr.timeIn,
        scheduleTimeIn: schedule.timeIn,
        lateMorning,
        lunchIn: dtr.lunchIn,
        scheduleLunchIn: schedule.lunchIn,
        lateAfternoon,
        minutesLate,
        noOfLates,
      });

      return {
        minutesLate,
        noOfLates,
      };
    }
  }
  //#endregion

  async getDtrByCompanyIdAndDay(data: { companyId: string; date: Date }) {
    try {
      const dateCurrent = dayjs(data.date).toDate();
      const id = data.companyId.replace('-', '');
      const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(data.companyId);
      const schedule = (await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeDetails.userId, dateCurrent)).schedule;

      const employeeIvmsDtr = (await this.client.call<string, { companyId: string; date: Date }, IvmsEntry[]>({
        action: 'send',
        payload: { companyId: id, date: dateCurrent },
        pattern: 'get_dtr_by_company_id_and_date',
        onError: (error) => new NotFoundException(error),
      })) as IvmsEntry[];

      //1. check if employee is in dtr table in the current date;
      const currEmployeeDtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      const { remarks } = (await this.rawQuery(`SELECT get_dtr_remarks(?,?) remarks;`, [employeeDetails.userId, dateCurrent]))[0];

      //1.2 if not in current mysql daily_time_record save data fetched from ivms
      if (!currEmployeeDtr) {
        //if schedule is regular
        await this.saveDtr(data.companyId, employeeIvmsDtr, schedule);
        //if schedule is night shift tabok2
      } else {
        if (schedule.id !== currEmployeeDtr.scheduleId)
          await this.crud().update({ dto: { scheduleId: { id: schedule.id } }, updateBy: { id: currEmployeeDtr.id } });
        await this.updateDtr(currEmployeeDtr, employeeIvmsDtr, schedule);
      }
      const dtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      const lates = await this.getLatesPerDay(dtr, schedule);
      //1.1 compute late by the day
      const noOfLates = lates.noOfLates;

      const totalMinutesLate = lates.minutesLate;
      //1.2 compute undertimes
      const noOfUndertimes = 0;
      const totalMinutesUndertime = 0;
      //1.3 halfday
      const isHalfDay = false;
      const summary = {
        noOfLates,
        totalMinutesLate,
        noOfUndertimes,
        totalMinutesUndertime,
        isHalfDay,
      };

      return { companyId: data.companyId, date: dayjs(data.date).format('YYYY-MM-DD'), schedule, dtr: { ...dtr, remarks }, summary };
    } catch (error) {
      const dateCurrent = dayjs(data.date).toDate();
      const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(data.companyId);
      const { remarks } = (await this.rawQuery(`SELECT get_dtr_remarks(?,?) remarks;`, [employeeDetails.userId, dateCurrent]))[0];
      return {
        //fetch day if may leave, holiday, pass slip
        schedule: {
          id: null,
          esDateFrom: null,
          esDateTo: null,
          dateFrom: null,
          dateTo: null,
          scheduleBase: null,
          scheduleRange: null,
          lunchIn: null,
          lunchOut: null,
          restDaysNames: null,
          restDaysNumbers: null,
          schedule: null,
          scheduleName: null,
          scheduleType: null,
          shift: null,
          timeIn: null,
          timeOut: null,
        },
        dtr: {
          companyId: null,
          createdAt: null,
          deletedAt: null,
          dtrDate: null,
          id: null,
          lunchIn: null,
          lunchOut: null,
          timeIn: null,
          timeOut: null,
          updatedAt: null,
          remarks,
        },
        summary: {
          noOfLates: null,
          totalMinutesLate: null,
          noOfUndertimes: null,
          totalMinutesUndertime: null,
          isHalfDay: false,
        },
      };
    }
  }

  private async countNoOfTimesLate() {}

  private async findByCompanyIdAndDate(companyId: string, dtrDate: Date) {
    const findResult = await this.crud().findOneOrNull({
      find: { where: { companyId, dtrDate } },
    });
    return findResult;
  }

  async updateDtr(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: any) {
    const { isIncompleteDtr } = (await this.rawQuery(`SELECT is_incomplete_dtr(?) isIncompleteDtr;`, [currEmployeeDtr.id]))[0];
    if (isIncompleteDtr === 1) {
      switch (schedule.scheduleName) {
        case 'Regular Morning Schedule':
          return await this.updateRegularMorningDtr(currEmployeeDtr, ivmsEntry, schedule);
        case 'Frontline Schedule Shift B':
          return await this.updateFrontlineScheduleShiftB(currEmployeeDtr, ivmsEntry, schedule);
        case 'Station Morning Schedule':
          return await this.updateFrontlineScheduleShiftB(currEmployeeDtr, ivmsEntry, schedule);
        case 'Station Night Schedule':
          return '';
        default:
          break;
      }
    }
  }

  async updateFrontlineScheduleShiftB(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn;
    let _timeOut;

    const { timeIn, timeOut } = schedule;

    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check if buntag or hapon nag in
          if (
            (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _timeIn = time;
          }
        } else {
          if (
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)) &&
            (dayjs().isAfter(dayjs('2023-01-01 ' + timeOut)) || dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)))
          ) {
            _timeOut = time;
          }
        }
      })
    );

    return await this.crudService.create({
      dto: {
        id: currEmployeeDtr.id,
        companyId: currEmployeeDtr.companyId,
        dtrDate: ivmsEntry[0].date,
        scheduleId: schedule,
        timeIn: _timeIn,
        timeOut: _timeOut,
      },
    });
  }

  async updateRegularMorningDtr(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn;
    let _lunchOut;
    let _lunchIn;
    let _timeOut;
    const { timeIn, timeOut, lunchOut, lunchIn } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check mo kung umaga nag in
          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchOut))
          ) {
            _timeIn = time;
          } else {
            //baka halfday lang siya
            //_lunchIn = lunchIn;
            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            ) {
              _lunchIn = time;
            }

            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            ) {
              _lunchOut = time;
            }
          }
        } else {
          //baka timeout or lunchout or lunchin
          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _lunchOut = time;
          }

          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            //dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _lunchIn = time;
          }
          if (
            (dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59'))
          ) {
            _timeOut = time;
          }
        }
      })
    );

    console.log('UPDATE');
    return await this.crudService.create({
      dto: {
        id: currEmployeeDtr.id,
        companyId: currEmployeeDtr.companyId,
        dtrDate: ivmsEntry[0].date,
        scheduleId: schedule,
        timeIn: _timeIn,
        timeOut: _timeOut,
        lunchIn: _lunchIn,
        lunchOut: _lunchOut,
      },
    });
  }

  async saveDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    switch (schedule.scheduleName) {
      case 'Regular Morning Schedule':
        return await this.addRegularMorningDtr(companyId, ivmsEntry, schedule);
      case 'Frontline Schedule Shift B':
        return await this.addFrontlineShiftBDtr(companyId, ivmsEntry, schedule);
      case 'Station Morning Schedule':
        return await this.addFrontlineShiftBDtr(companyId, ivmsEntry, schedule);
      case 'Station Night Schedule':
        return await this.addNightScheduleDtr(companyId, ivmsEntry, schedule);
      default:
        break;
    }
  }

  //#region add functionalities for different kinds of schedule
  async addNightScheduleDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    //GABI!
    let _timeIn = null;
    let _timeOut = null;

    const { timeIn, timeOut } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time } = ivmsEntryItem;
        if (
          dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 11:59:59')) &&
          (dayjs('2023-01-01 ' + time).isBefore('2023-01-02 ' + timeOut) || dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)))
        ) {
          if (_timeIn === null) {
            _timeIn = time;
          }
        } else {
          //out sa previous day
          _timeOut = time;
        }
      })
    );
    //insert sa karon na (in)
    await this.crudService.create({ dto: { companyId, timeIn: _timeIn, scheduleId: schedule, dtrDate: ivmsEntry[0].date } });
    //insert or update sa kagahapon na sched (out)
    //what if kagahapon lahi iyang schedule?
    const yesterday = dayjs(ivmsEntry[0].date).subtract(1, 'day');
    const yesterdayDtr = await this.crudService.findOneOrNull({
      find: { where: { companyId, dtrDate: yesterday.toDate() } },
      onError: (error) => new InternalServerErrorException(error),
    });

    if (yesterdayDtr !== null)
      await this.crudService.create({
        dto: { companyId, timeOut: _timeOut, dtrDate: yesterday.toDate(), id: yesterdayDtr.id },
        onError: (error) => new InternalServerErrorException(error),
      });
    else
      await this.crudService.create({
        dto: { companyId, timeOut: _timeOut, dtrDate: yesterday.toDate() },
        onError: (error) => new InternalServerErrorException(error),
      });
    return '';
  }

  async addFrontlineShiftBDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn;
    let _timeOut;

    const { timeIn, timeOut } = schedule;

    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check if buntag or hapon nag in
          if (
            (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _timeIn = time;
          }
        } else {
          if (
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)) &&
            (dayjs().isAfter(dayjs('2023-01-01 ' + timeOut)) || dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)))
          ) {
            _timeOut = time;
          }
        }
      })
    );

    return await this.crudService.create({
      dto: {
        companyId,
        dtrDate: ivmsEntry[0].date,
        scheduleId: schedule,
        timeIn: _timeIn,
        timeOut: _timeOut,
      },
    });
  }

  async addRegularMorningDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn;
    let _lunchOut;
    let _lunchIn;
    let _timeOut;
    const { timeIn, timeOut, lunchOut, lunchIn } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check mo kung umaga nag in
          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchOut))
          ) {
            _timeIn = time;
          } else {
            //baka halfday lang siya
            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            ) {
              _lunchIn = time;
            }

            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            ) {
              _lunchOut = time;
            }
          }
        } else {
          //baka timeout or lunchout or lunchin
          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _lunchOut = time;
          }

          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
            //dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            _lunchIn = time;
          }
          if (
            (dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59'))
          ) {
            _timeOut = time;
          }
        }
      })
    );
    console.log('save');
    return await this.crudService.create({
      dto: {
        companyId,
        dtrDate: ivmsEntry[0].date,
        scheduleId: schedule,
        timeIn: _timeIn,
        timeOut: _timeOut,
        lunchIn: _lunchIn,
        lunchOut: _lunchOut,
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  //#endregion

  async updateEmployeeDTR(dailyTimeRecordDto: UpdateDailyTimeRecordDto) {
    const { dtrDate, companyId, ...rest } = dailyTimeRecordDto;
    const updateResult = await this.crud().update({ dto: rest, updateBy: { companyId, dtrDate }, onError: () => new InternalServerErrorException() });
    if (updateResult.affected > 0) return dailyTimeRecordDto;
  }
}
