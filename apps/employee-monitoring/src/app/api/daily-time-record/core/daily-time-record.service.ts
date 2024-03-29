/* eslint-disable @typescript-eslint/no-empty-function */
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { DailyTimeRecord, DtrCorrection, UpdateDailyTimeRecordDto } from '@gscwd-api/models';
import { DtrPayload, IvmsEntry, EmployeeScheduleType, MonthlyDtrItemType } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { EmployeesService } from '../../employees/core/employees.service';
import { HolidaysService } from '../../holidays/core/holidays.service';
import { LeaveCardLedgerDebitService } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { EmployeeScheduleService } from '../components/employee-schedule/core/employee-schedule.service';
import { DtrCorrectionService } from '../../dtr-correction/core/dtr-correction.service';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<DailyTimeRecord> {
  constructor(
    private readonly crudService: CrudService<DailyTimeRecord>,
    private readonly client: MicroserviceClient,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly holidayService: HolidaysService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly employeeService: EmployeesService
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

  async getHasIvms(data: { companyId: string; entryDate: Date }) {
    return (await this.client.call<string, { companyId: string; entryDate: Date }, boolean>({
      action: 'send',
      payload: data,
      pattern: 'get_has_ivms',
    })) as boolean;
  }

  private getDayRange(numberOfDays: number) {
    switch (numberOfDays) {
      case 15:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
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

  async generateAllEmployeeDtrByMonthAndYear() {}

  async getEmployeeDtrByMonthAndYear(companyId: string, year: number, month: number) {
    const daysInMonth = dayjs(year + '-' + month + '-' + '01').daysInMonth();

    const dayRange = this.getDayRange(daysInMonth);

    //#region for map
    const dtrDays: MonthlyDtrItemType[] = (await Promise.all(
      dayRange.map(async (dtrDay, idx) => {
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
              noAttendance: null,
            },
          };
        }
      })
    )) as MonthlyDtrItemType[];
    //#endregion map

    const summary = await this.getSummary(dtrDays);

    return { dtrDays, summary };
  }

  async getSummary(dtrDays: MonthlyDtrItemType[]) {
    let noOfTimesLate = 0;
    let totalMinutesLate = 0;
    let noOfTimesUndertime = 0;
    let totalMinutesUndertime = 0;
    let noAttendance = [];
    let noOfTimesHalfDay = 0;
    const lateDates: number[] = [];
    const undertimeDates: number[] = [];
    const summaryResult = await Promise.all(
      dtrDays.map(async (dtrDay: MonthlyDtrItemType) => {
        const { summary, dtr, day, holidayType, schedule } = dtrDay;
        noOfTimesLate += summary.noOfLates;
        totalMinutesLate += summary.totalMinutesLate;

        if (summary.noOfLates > 0) {
          const day = dayjs(dtr.dtrDate).date();
          lateDates.push(day);
        }

        if (summary.noAttendance > 0) {
          noAttendance.push(parseInt(dayjs(day).format('D')));
        }

        if (summary.isHalfDay) {
          noOfTimesHalfDay += 1;
        }

        noOfTimesUndertime += summary.noOfTimesUndertime;
        totalMinutesUndertime += summary.totalMinutesUndertime;

        if (summary.noOfTimesUndertime > 0) {
          const day = dayjs(dtr.dtrDate).date();
          undertimeDates.push(day);
        }
      })
    );
    return { noOfTimesLate, totalMinutesLate, lateDates, noOfTimesHalfDay, noOfTimesUndertime, totalMinutesUndertime, undertimeDates, noAttendance };
  }

  //#region lates,undertimes,halfday functionalities

  async getLatesUndertimesNoAttendancePerDay(dtr: DailyTimeRecord, schedule: EmployeeScheduleType, employeeId: string) {
    let minutesLate = 0;
    let noOfLates = 0;
    let noOfUndertimes = 0;
    let minutesUndertime = 0;
    let isHalfDay = false;

    if (schedule.shift === 'day') {
      const lateMorning = dayjs(dayjs('2023-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm')).diff(
        dayjs('2023-01-01 ' + schedule.timeIn).format('YYYY-MM-DD HH:mm'),
        'm'
      );

      const lateAfternoon = dayjs(dayjs('2023-01-01 ' + dtr.lunchIn).format('YYYY-MM-DD HH:mm')).diff(
        dayjs('2023-01-01' + schedule.lunchIn)
          .add(29, 'minute')
          .format('YYYY-MM-DD HH:mm'),
        'm'
      );

      if (lateMorning > 0) {
        minutesLate += lateMorning;
        noOfLates += 1;
      }

      if (dtr.timeIn !== null && dtr.lunchOut !== null && dtr.lunchIn !== null && lateAfternoon > 0) {
        minutesLate += lateAfternoon;
        noOfLates += 1;
      }

      /*
          if no attendance morning and late in the afternoon in, therefore count minutes late and at the same time no of lates
          

          if no attendance in the morning and not late in the afternoon count as halfday and add in noOfLates 
          
          
      */

      if (dtr.timeIn === null && dtr.lunchOut === null && dtr.lunchIn !== null && lateAfternoon > 0) {
        isHalfDay = true;
        minutesLate += lateAfternoon;
        noOfLates += 2;
      }

      if (dtr.timeIn === null && dtr.lunchOut === null && lateAfternoon <= 0) {
        isHalfDay = true;
        noOfLates += 1;
      }
    }

    let noAttendance = 0;

    if (dtr.lunchIn === null && dtr.lunchOut === null && dtr.timeIn === null && dtr.timeOut === null && schedule.scheduleName !== null) {
      noAttendance = 1;
    }

    const undertime = (await this.rawQuery(
      `
      SELECT DATE_FORMAT(date_of_application,'%Y-%m-%d') dateOfApplication,ps.time_out undertimeOut FROM pass_slip ps 
        INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk 
      WHERE psa.status = 'used' 
      AND ps.employee_id_fk = ? 
      AND date_of_application = ?;
    `,
      [employeeId, dayjs(dtr.dtrDate).format('YYYY-MM-DD')]
    )) as { dateOfApplication: Date; undertimeOut: Date }[];

    if (undertime.length > 0) {
      //do the math
      const { dateOfApplication, undertimeOut } = undertime[0];
      noOfUndertimes = 1;
      minutesUndertime = dayjs(dayjs('2023-01-01 ' + schedule.timeOut).format('YYYY-MM-DD HH:mm')).diff(
        dayjs('2023-01-01 ' + undertimeOut).format('YYYY-MM-DD HH:mm'),
        'm'
      );
    }
    return {
      minutesLate,
      noOfLates,
      noOfUndertimes,
      minutesUndertime,
      noAttendance,
      isHalfDay,
    };
  }
  //#endregion

  async getDtrByCompanyIdAndDay(data: { companyId: string; date: Date }) {
    try {
      const dateCurrent = dayjs(data.date).toDate();
      const id = data.companyId.replace('-', '');

      const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(data.companyId);

      const schedule = (await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeDetails.userId, dateCurrent)).schedule;

      const restDays = typeof schedule.restDaysNumbers === 'undefined' ? [] : schedule.restDaysNumbers.split(', ');
      const day = dayjs(data.date).format('d');

      const { leaveDateStatus } = (await this.rawQuery(`SELECT get_leave_date_status(?,?) leaveDateStatus;`, [employeeDetails.userId, data.date]))[0];

      let isRestDay: boolean;

      isRestDay = day in restDays ? true : false;

      console.log(isRestDay);

      const employeeIvmsDtr = (await this.client.call<string, { companyId: string; date: Date }, IvmsEntry[]>({
        action: 'send',
        payload: { companyId: id, date: dateCurrent },
        pattern: 'get_dtr_by_company_id_and_date',
        onError: (error) => {
          console.log(error);
          throw new NotFoundException(error);
        },
      })) as IvmsEntry[];

      let hasPendingDtrCorrection = false;
      let dtrCorrection: DtrCorrection;

      const isHoliday = await this.holidayService.isHoliday(data.date);
      //1. check if employee is in dtr table in the current date;
      const currEmployeeDtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      const { remarks } = (
        await this.rawQuery(`SELECT get_dtr_remarks(?,?) remarks;`, [employeeDetails.userId, dayjs(dateCurrent).format('YYYY-MM-DD')])
      )[0];

      //1.2 if not in current mysql daily_time_record save data fetched from ivms
      if (currEmployeeDtr === null) {
        //if schedule is regular
        await this.saveDtr(data.companyId, employeeIvmsDtr, schedule);
        console.log('dtr log:', currEmployeeDtr);
        //if schedule is night shift tabok2
      } else {
        if (schedule.id !== currEmployeeDtr.scheduleId)
          await this.crud().update({ dto: { scheduleId: { id: schedule.id } }, updateBy: { id: currEmployeeDtr.id } });
        await this.updateDtr(currEmployeeDtr, employeeIvmsDtr, schedule);
        hasPendingDtrCorrection = await this.hasPendingDtrCorrection(currEmployeeDtr.id);
        dtrCorrection = await this.getDtrCorrection(currEmployeeDtr.id);
      }
      const dtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      const latesUndertimesNoAttendance = await this.getLatesUndertimesNoAttendancePerDay(dtr, schedule, employeeDetails.userId);
      //const undertimes = await this.getUndertimesPerDay(dtr, schedule);

      //1.1 compute late by the day
      const noOfLates = latesUndertimesNoAttendance.noOfLates;
      if (noOfLates > 0) {
        //insert to leave card ledger debit;
        //insert only if permanent or casual;
        if (employeeDetails.userRole !== 'job_order') {
          const leaveCardItem = await this.leaveCardLedgerDebitService
            .crud()
            .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id } } } });
          let debitValue = 0;

          if (!leaveCardItem) {
            debitValue = (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [dtr.id]))[0].debitValue;

            await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
              dailyTimeRecordId: dtr,
              debitValue,
              createdAt: dtr.dtrDate,
            });
          }
        }
      }

      const totalMinutesLate = latesUndertimesNoAttendance.minutesLate;
      //1.2 compute undertimes
      const noOfTimesUndertime = latesUndertimesNoAttendance.noOfUndertimes;
      const totalMinutesUndertime = latesUndertimesNoAttendance.minutesUndertime;

      //1.3 halfday
      const isHalfDay = latesUndertimesNoAttendance.isHalfDay;
      //1.4 no attendance
      const noAttendance = latesUndertimesNoAttendance.noAttendance;
      const summary = {
        noOfLates,
        totalMinutesLate,
        noOfTimesUndertime,
        totalMinutesUndertime,
        noAttendance,
        isHalfDay,
      };
      return {
        companyId: data.companyId,
        date: dayjs(data.date).format('YYYY-MM-DD'),
        schedule,
        leaveDateStatus,
        isHoliday,
        isRestDay,
        hasPendingDtrCorrection,
        dtrCorrection,
        dtr: { ...dtr, remarks },
        summary,
      };
    } catch (error) {
      const dateCurrent = dayjs(data.date).toDate();
      const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(data.companyId);
      const schedule = (await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeDetails.userId, dateCurrent)).schedule;
      console.log(schedule);
      //const cancelledLeaveStatus = false;
      const restDays = schedule.restDaysNumbers.split(', ');
      const { leaveDateStatus } = (await this.rawQuery(`SELECT get_leave_date_status(?,?) leaveDateStatus;`, [employeeDetails.userId, data.date]))[0];

      console.log(leaveDateStatus);

      console.log('rest', restDays);

      const day = dayjs(data.date).format('d');

      const isRestDay: boolean = day in restDays ? true : false;

      const { remarks } = (
        await this.rawQuery(`SELECT get_dtr_remarks(?,?) remarks;`, [employeeDetails.userId, dayjs(dateCurrent).format('YYYY-MM-DD')])
      )[0];
      console.log('remarks', remarks);
      const isHoliday = await this.holidayService.isHoliday(data.date);
      let noAttendance = 1;
      if ((remarks !== null && remarks !== '') || dayjs(dateCurrent).isAfter(dayjs())) {
        console.log('here here here');
        noAttendance = 0;
      }
      return {
        //fetch day if may leave, holiday, pass slip
        schedule,
        leaveDateStatus,
        isHoliday,
        isRestDay,
        hasPendingDtrCorrection: false,
        dtrCorrection: null,
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
          noOfTimesUndertime: null,
          totalMinutesUndertime: null,
          noAttendance,
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

  async updateDtr(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: EmployeeScheduleType) {
    const { isIncompleteDtr } = (await this.rawQuery(`SELECT is_incomplete_dtr(?) isIncompleteDtr;`, [currEmployeeDtr.id]))[0];

    if (parseInt(isIncompleteDtr) === 1) {
      switch (schedule.shift) {
        case 'day':
          if (schedule.lunchOut !== null && schedule.lunchIn !== null) {
            return await this.updateRegularMorningDtr(currEmployeeDtr, ivmsEntry, schedule);
          } else return await this.updateRegularWithOutLunch(currEmployeeDtr, ivmsEntry, schedule);
        case 'night':
          return '';
        default:
          break;
      }
    }
  }

  async updateRegularWithOutLunch(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn = null;
    let _timeOut = null;
    const { timeIn, timeOut } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check mo kung umaga nag in
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn))) {
            _timeIn = time;
          } else {
            //baka halfday lang siya
            if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))) {
              _timeIn = time;
            }
          }
        } else {
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))) {
            if (_timeIn === null) _timeIn = time;
          }
          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(2, 'hour'))
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
      onError: () => new InternalServerErrorException(),
    });
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
    let _timeIn = null;
    let _lunchOut = null;
    let _lunchIn = null;
    let _timeOut = null;
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
            if (_lunchIn === null) _lunchIn = time;
          }
          if (
            (_timeIn && _lunchOut && _lunchIn && idx === ivmsEntry.length - 1 && dayjs('2023-01-01 ' + time).isAfter('2023-01-01 13:00:59')) ||
            ((dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')))
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
        lunchIn: _lunchIn,
        lunchOut: _lunchOut,
      },
    });
  }

  async saveDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: EmployeeScheduleType) {
    switch (schedule.shift) {
      case 'day':
        if (schedule.lunchOut !== null && schedule.lunchIn !== null) {
          return await this.addRegularMorningDtr(companyId, ivmsEntry, schedule);
        } else return await this.addRegularWithOutLunch(companyId, ivmsEntry, schedule);
      case 'night':
        return await this.addNightScheduleDtr(companyId, ivmsEntry, schedule);
      default:
        break;
    }
  }

  //#region add functionalities for different kinds of schedule
  async addRegularWithOutLunch(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn = null;
    let _timeOut = null;
    const { timeIn, timeOut } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check mo kung umaga nag in
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn))) {
            _timeIn = time;
          } else {
            //baka halfday lang siya
            if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))) {
              _timeIn = time;
            }
          }
        } else {
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))) {
            if (_timeIn === null) _timeIn = time;
          }
          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(2, 'hour'))
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
      onError: () => new InternalServerErrorException(),
    });
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
    let _timeIn = null;
    let _lunchOut = null;
    let _lunchIn = null;
    let _timeOut = null;
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
            if (_lunchIn === null) _lunchIn = time;
          }
          if (
            (idx === ivmsEntry.length - 1 && dayjs('2023-01-01 ' + time).isAfter('2023-01-01 13:00:59')) ||
            ((dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut)) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')))
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
        lunchIn: _lunchIn,
        lunchOut: _lunchOut,
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  //#endregion
  async updateEmployeeDTR(dailyTimeRecordDto: UpdateDailyTimeRecordDto) {
    const { dtrDate, companyId, ...rest } = dailyTimeRecordDto;
    const employeeId = (await this.employeeService.getEmployeeDetailsByCompanyId(companyId)).userId;
    const schedule = await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeId, dtrDate);

    if (schedule.schedule.withLunch === 'true') {
      if (rest.lunchIn === null || rest.lunchOut === null || rest.timeIn === null || rest.timeOut === null) {
        throw new HttpException('Please fill out time scans completely', 406);
      }
    }
    const updateResult = await this.crud().update({
      dto: rest,
      updateBy: { companyId, dtrDate },
      onError: (error) => {
        console.log(error);
        return new InternalServerErrorException();
      },
    });

    if (updateResult.affected > 0) return dailyTimeRecordDto;
    else throw new HttpException('No attendance found on this date', HttpStatus.NOT_ACCEPTABLE);
  }

  @Cron('0 59 23 * * 0-6')
  async addDTRToLedger() {
    const employees = (await this.employeeService.getAllPermanentEmployeeIds()) as { employeeId: string; companyId: string }[];

    const ledger = await Promise.all(
      employees.map(async (employee) => {
        const now = dayjs();
        const { companyId } = employee;
        const data = { companyId, date: dayjs(now.format('YYYY-MM-DD')).toDate() };
        await this.getDtrByCompanyIdAndDay(data);
      })
    );
    console.log('CRON Job for DTR Ledger');
  }

  async hasPendingDtrCorrection(dtrId: string) {
    const hasPendingDtrCorrection = (
      await this.rawQuery(
        `SELECT IF(count(distinct daily_time_record_id_fk)>0,true,false) hasPendingDtrCorrection 
            FROM dtr_correction 
         WHERE daily_time_record_id_fk = ? AND status='for approval'`,
        [dtrId]
      )
    )[0].hasPendingDtrCorrection;
    return hasPendingDtrCorrection === '0' ? false : true;
  }

  async getDtrCorrection(dtrId: string) {
    const dtrCorrection = (
      await this.rawQuery(
        `SELECT time_in timeIn, lunch_out lunchOut, lunch_in lunchIn,time_out timeOut, status,remarks FROM dtr_correction WHERE daily_time_record_id_fk = ?`,
        [dtrId]
      )
    )[0] as DtrCorrection;
    return dtrCorrection;
  }
}
