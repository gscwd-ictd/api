import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { CreateDtrRemarksDto, DailyTimeRecord, DtrCorrection, UpdateDailyTimeRecordDto, UpdateDtrRemarksDto } from '@gscwd-api/models';
import { IvmsEntry, EmployeeScheduleType, MonthlyDtrItemType, DtrDeductionType, ReportHalf, getDayRange1stHalf, getDayRange2ndHalf } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { EmployeesService } from '../../employees/core/employees.service';
import { HolidaysService } from '../../holidays/core/holidays.service';
import { LeaveCardLedgerDebitService } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { EmployeeScheduleService } from '../components/employee-schedule/core/employee-schedule.service';
import { WorkSuspensionService } from '../../work-suspension/core/work-suspension.service';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<DailyTimeRecord> {
  constructor(
    private readonly crudService: CrudService<DailyTimeRecord>,
    private readonly client: MicroserviceClient,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly holidayService: HolidaysService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly employeeService: EmployeesService,
    private readonly workSuspensionService: WorkSuspensionService
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

  //get_entries_the_day_and_the_next
  async getEntriesTheDayAndTheNext(entry: { companyId: string; date: Date }) {
    return (await this.client.call<string, { companyId: string; date: Date }, string>({
      action: 'send',
      payload: entry,
      pattern: 'get_entries_the_day_and_the_next',
    })) as string;
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

  async generateAllEmployeeDtrByMonthAndYear() { }

  async getEmployeeDtrByMonthAndYear(companyId: string, year: number, month: number, half: ReportHalf) {
    const daysInMonth = dayjs(year + '-' + month + '-' + '01').daysInMonth();
    const dayRange = this.getDayRange(daysInMonth);
    const days =
      half === ReportHalf.FIRST_HALF ? getDayRange1stHalf() : half === ReportHalf.SECOND_HALF ? getDayRange2ndHalf(daysInMonth) : typeof half === 'undefined' || half === '' ? dayRange : [];
    //#region for map
    const dtrDays: MonthlyDtrItemType[] = (await Promise.all(
      days.map(async (dtrDay, idx) => {
        const currDate = dayjs(year + '-' + month + '-' + dtrDay).toDate();
        const holidayType = await this.holidayService.getHolidayTypeByDate(currDate);

        try {
          const dtr = await this.getDtrByCompanyIdAndDay({ companyId, date: dayjs(dayjs(currDate).format('YYYY-MM-DD')).toDate() });

          return { day: dayjs(currDate).format('YYYY-MM-DD'), holidayType, ...dtr };
        } catch {
          const currDate = dayjs(year + '-' + month + '-' + dtrDay).toDate();
          // #region rework get only id by company_id;
          const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(companyId);
          // #endregion
          const { remarks } = (
            await this.rawQuery(`SELECT get_dtr_remarks(?,?,?) remarks;`, [employeeDetails.userId, currDate, employeeDetails.companyId])
          )[0];

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
    const noAttendance = [];
    let noOfTimesHalfDay = 0;
    const lateDates: number[] = [];
    const undertimeDates: number[] = [];
    const halfDayDates: number[] = [];

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
          const day = dayjs(dtr.dtrDate).date();
          noOfTimesHalfDay += 1;
          halfDayDates.push(day);
        }

        noOfTimesUndertime += summary.noOfTimesUndertime;
        totalMinutesUndertime += summary.totalMinutesUndertime;

        if (summary.noOfTimesUndertime > 0) {
          const day = dayjs(dtr.dtrDate).date();
          undertimeDates.push(day);
        }
      })
    );
    return {
      noOfTimesLate,
      totalMinutesLate,
      lateDates,
      noOfTimesHalfDay,
      noOfTimesUndertime,
      totalMinutesUndertime,
      undertimeDates,
      noAttendance,
      halfDayDates,
    };
  }

  //#region lates,undertimes,halfday functionalities

  async getLatesUndertimesNoAttendancePerDay(dtr: DailyTimeRecord, schedule: EmployeeScheduleType, employeeId: string) {
    let minutesLate = 0;
    let noOfLates = 0;
    let noOfUndertimes = 0;
    let minutesUndertime = 0;
    let isHalfDay = false;
    let noAttendance = 0;

    const workSuspensionStart = dayjs(await this.workSuspensionService.getWorkSuspensionStart(schedule.timeOut, dtr.dtrDate));
    const timeOutDay = schedule.shift === 'night' ? '2024-01-02 ' : '2024-01-01 ';
    //schedule.restDaysNumbers
    const restDays = typeof schedule.restDaysNumbers === 'undefined' ? [] : schedule.restDaysNumbers.split(', ');
    const day = dayjs(dayjs(dtr.dtrDate).format('YYYY-MM-DD')).format('d');
    const isRestDay = restDays.includes(day);
    const isHoliday = await this.holidayService.isHoliday(dtr.dtrDate);

    const isWithLunch = schedule.lunchOut !== null && schedule.lunchIn !== null ? true : false;

    const restHourStart = dayjs('2024-01-01 ' + schedule.timeIn).add(4, 'h');
    const restHourEnd = dayjs('2024-01-01 ' + schedule.timeIn).add(5, 'h');

    const dtrRemarks = (
      await this.rawQuery(`SELECT remarks FROM daily_time_record WHERE company_id_fk = ? AND dtr_date=?`, [dtr.companyId, dtr.dtrDate])
    )[0].remarks as string;

    const isLNDRemarks = dtrRemarks !== null ? dtrRemarks.includes('L & D') || dtrRemarks.includes('Office Event') : false;

    const overtimeApplicationCount = (
      await this.rawQuery(
        `
        SELECT COUNT(DISTINCT oa.overtime_application_id) countOvertime
          FROM overtime_application oa 
        INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id
        WHERE oe.employee_id_fk = ? AND DATE_FORMAT(oa.planned_date,'%Y-%m-%d') = ?;
    `,
        [employeeId, dtr.dtrDate]
      )
    )[0].countOvertime;

    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(dtr.dtrDate);
    const suspensionTimeOutDay = schedule.shift === 'night' ? dayjs(dtr.dtrDate.toString()).add(1, 'day').format('YYYY-MM-DD') : dtr.dtrDate;

    const timeOutWithinRestHours =
      dayjs(timeOutDay + dtr.timeOut).isSame(restHourStart) ||
      (dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart) && dayjs(timeOutDay + dtr.timeOut).isBefore(restHourEnd)) ||
      dayjs(timeOutDay + dtr.timeOut).isSame(restHourEnd);
    //overtimeApplicationCount === '0' &&

    if (!isHoliday && !isRestDay && !isLNDRemarks) {
      //uncomment just in case
      //if (schedule.shift === 'day') {

      // const lateMorning = isWithLunch
      //   ? dayjs(dayjs('2024-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm')).diff(
      //       dayjs('2024-01-01 ' + schedule.timeIn).format('YYYY-MM-DD HH:mm'),
      //       'm'
      //     )
      //   : dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourEnd)
      // ? dayjs(dayjs('2024-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm:00')).diff(
      //     dayjs('2024-01-01 ' + schedule.timeOut).format('YYYY-MM-DD HH:mm:00'),
      //     'm'
      //   )
      //   : 0;

      const lateMorning = isWithLunch
        ? dayjs(dayjs('2024-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm')).diff(
          dayjs('2024-01-01 ' + schedule.timeIn).format('YYYY-MM-DD HH:mm'),
          'm'
        )
        : dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourEnd)
          ? dayjs(dayjs('2024-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm:00')).diff(dayjs(restHourEnd).format('YYYY-MM-DD HH:mm:00'), 'm')
          : dayjs(dayjs('2024-01-01 ' + dtr.timeIn).format('YYYY-MM-DD HH:mm')).diff(
            dayjs('2024-01-01 ' + schedule.timeIn).format('YYYY-MM-DD HH:mm'),
            'm'
          );

      const lateAfternoon = isWithLunch
        ? dayjs(dayjs('2024-01-01 ' + dtr.lunchIn).format('YYYY-MM-DD HH:mm')).diff(
          dayjs('2024-01-01' + schedule.lunchIn)
            .add(29, 'minute')
            .format('YYYY-MM-DD HH:mm'),
          'm'
        )
        : 0;

      if (lateMorning > 0) {
        minutesLate += lateMorning;
        noOfLates += 1;
      }

      if (isWithLunch && dtr.timeIn !== null && dtr.lunchOut !== null && dtr.lunchIn !== null && lateAfternoon > 0) {
        minutesLate += lateAfternoon;
        noOfLates += 1;
      }

      // half day hapon pumasok without lunch
      if (
        !isWithLunch &&
        (dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourEnd) ||
          dayjs('2024-01-01 ' + dtr.timeIn).isSame(restHourEnd) ||
          (dayjs('2024-01-01 ' + dtr.timeIn).isSame(restHourStart) &&
            dayjs('2024-01-01 ' + dtr.timeIn).isBefore(restHourEnd) &&
            dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourStart)))
      ) {
        isHalfDay = true;
        if (dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourEnd)) noOfLates += 1;
      }

      //half day morning pumasok without lunch
      if (
        // !isWithLunch &&
        (dayjs(timeOutDay + dtr.timeOut).isSame(restHourStart) || dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart)) &&
        (dayjs(timeOutDay + dtr.timeOut).isBefore(restHourEnd) || dayjs(timeOutDay + dtr.timeOut).isSame(restHourEnd))
      ) {
        if (suspensionHours > 0) {
          if (dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isBefore(workSuspensionStart)) {
            noOfUndertimes = 1;
            isHalfDay = true;
          }
        } else {
          noOfUndertimes = 1;
          isHalfDay = true;
        }
      }

      if (isWithLunch && dtr.timeIn === null && dtr.lunchOut === null && dtr.lunchIn !== null && lateAfternoon > 0) {
        /*
            if no attendance morning and late in the afternoon in, therefore count minutes late and at the same time no of lates
            
            if no attendance in the morning and not late in the afternoon count as halfday and add in noOfLates 
        */
        //MORNING HALFDAY LATE AFTERNOON
        isHalfDay = true;
        minutesLate += lateAfternoon; //+ 240;
        noOfLates += 2;
      }

      if (!isWithLunch && dtr.timeIn === null && dtr.lunchOut === null && lateAfternoon > 0) {
        isHalfDay = true;
        minutesLate += lateAfternoon; //+ 240;
        noOfLates += 2;
      }

      if (isWithLunch && dtr.timeIn === null && dtr.lunchOut === null && dtr.lunchIn !== null && lateAfternoon <= 0) {
        isHalfDay = true;
        noOfLates = 1;
      }

      if (isWithLunch && dtr.timeIn !== null && dtr.lunchOut !== null && lateMorning > 0 && dtr.lunchIn === null && dtr.timeOut === null) {
        minutesLate += isNaN(lateAfternoon) ? 0 : lateAfternoon;
        isHalfDay = true;
        noOfUndertimes = 1;
      }

      if (dtr.timeIn !== null && dtr.lunchOut !== null && lateMorning <= 0 && dtr.lunchIn === null && dtr.timeOut === null) {
        /*
        &&
        dayjs(dtr.dtrDate + ' ' + dtr.timeOut).isBefore(workSuspensionStart)
        */
        isHalfDay = true;
        noOfUndertimes = 1;
      }

      if (
        dtr.timeIn !== null &&
        dtr.lunchOut !== null &&
        lateMorning <= 0 &&
        dtr.lunchIn === null &&
        dtr.timeOut === null &&
        (dayjs(timeOutDay + dtr.timeOut).isAfter(workSuspensionStart) || dayjs(timeOutDay + dtr.timeOut).isSame(workSuspensionStart))
      ) {
        /*
        &&
        dayjs(dtr.dtrDate + ' ' + dtr.timeOut).isBefore(workSuspensionStart)
        */
        isHalfDay = false;
        noOfUndertimes = 0;
      }

      //half day - pm time in
      if (
        isWithLunch === false &&
        (dayjs('2024-01-01 ' + dtr.timeIn).isAfter(restHourStart) || dayjs('2024-01-01 ' + dtr.timeIn).isSame(restHourStart)) &&
        (dayjs('2024-01-01 ' + dtr.timeIn).isSame(restHourEnd) || dayjs('2024-01-01 ' + dtr.timeIn).isBefore(restHourEnd))
      ) {
        isHalfDay = true;
        minutesLate = lateAfternoon; //+ 240;
        noOfLates = 1;
      }

      //halfday-am time in
      if (
        (dayjs(dtr.dtrDate + ' ' + dtr.timeIn).isBefore(restHourStart) && dayjs(timeOutDay + dtr.timeOut).isSame(restHourStart)) ||
        (dayjs(dtr.dtrDate + ' ' + dtr.timeIn).isBefore(restHourStart) &&
          dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart) &&
          dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart) &&
          (dayjs(timeOutDay + dtr.timeOut).isBefore(restHourEnd) || dayjs(dtr.dtrDate + ' ' + dtr.timeOut).isSame(restHourEnd)))
      ) {
        //isWithLunch === false &&
        isHalfDay = true;
        noOfUndertimes = 1;
        if (dayjs(timeOutDay + dtr.timeOut).isAfter(workSuspensionStart) || dayjs(timeOutDay + dtr.timeOut).isSame(workSuspensionStart)) {
          isHalfDay = false;
          noOfUndertimes = 0;
        }
      }

      if (
        (dayjs('2024-01-01 ' + dtr.timeIn).isBefore(restHourStart) && dayjs(timeOutDay + dtr.timeOut).isSame(restHourStart)) ||
        (dayjs('2024-01-01 ' + ' ' + dtr.timeIn).isBefore(restHourStart) &&
          dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart) &&
          dayjs(timeOutDay + dtr.timeOut).isAfter(restHourStart) &&
          (dayjs(timeOutDay + dtr.timeOut).isBefore(restHourEnd) || dayjs(timeOutDay + dtr.timeOut).isSame(restHourEnd)) &&
          (dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isAfter(workSuspensionStart) ||
            dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isSame(workSuspensionStart)))
      ) {
        //isWithLunch === false &&
        isHalfDay = false;
        noOfUndertimes = 0;
        //isWithLunch === false &&
      }

      //}

      if (
        dtr.lunchIn === null &&
        dtr.lunchOut === null &&
        dtr.timeIn === null &&
        dtr.timeOut === null &&
        schedule.scheduleName !== null &&
        dtrRemarks.length === 0
      ) {
        noAttendance = 1;
      }

      const passSlipsNatureOfBusiness = (await this.rawQuery(
        `
      SELECT nature_of_business natureOfBusiness  FROM pass_slip ps 
        INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk
      WHERE ps.employee_id_fk = ? 
      AND DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') = ?
      AND psa.status = 'approved';
      `,
        [employeeId, dtr.dtrDate]
      )) as { natureOfBusiness: string }[];

      let passSlipNatureOfBusiness: string = null;
      if (passSlipsNatureOfBusiness.length > 0)
        passSlipNatureOfBusiness = passSlipsNatureOfBusiness[passSlipsNatureOfBusiness.length - 1].natureOfBusiness;
      minutesUndertime =
        !timeOutWithinRestHours && suspensionHours <= 0
          ? dayjs(dayjs('2023-01-01 ' + schedule.timeOut).format('YYYY-MM-DD HH:mm')).diff(
            dayjs('2023-01-01 ' + dtr.timeOut).format('YYYY-MM-DD HH:mm'),
            'm'
          )
          : 0;

      //minutesUndertime if there is work suspension;
      if (timeOutWithinRestHours && suspensionHours < 4 && suspensionHours > 0) {
        if (
          dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isAfter(workSuspensionStart) ||
          dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isSame(workSuspensionStart)
        )
          isHalfDay = false;
        else isHalfDay = true;
        //noOfLates += 1;
      }

      if (minutesUndertime > 0) {
        noOfUndertimes = 1;
      }

      if (dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).isBefore(workSuspensionStart)) {
        minutesUndertime = !timeOutWithinRestHours
          ? dayjs(dayjs(workSuspensionStart).format('YYYY-MM-DD HH:mm')).diff(
            dayjs(suspensionTimeOutDay + ' ' + dtr.timeOut).format('YYYY-MM-DD HH:mm'),
            'm'
          )
          : 0;
        noOfUndertimes = 1;
      }

      if (suspensionHours === 4) {
        isHalfDay = false;
      }

      //change undertime logic

      //if(dtr.timeOut)

      /* const undertime = (await this.rawQuery(
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
      }*/
    }

    return {
      minutesLate,
      noOfLates,
      noOfUndertimes,
      minutesUndertime: minutesUndertime > 0 ? minutesUndertime : 0,
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

      const restDays =
        typeof schedule === 'undefined' ? [] : typeof schedule.restDaysNumbers === 'undefined' ? [] : schedule.restDaysNumbers.split(', ');

      const day = dayjs(dayjs(dateCurrent).format('YYYY-MM-DD')).format('d');

      const { leaveDateStatus } = (await this.rawQuery(`SELECT get_leave_date_status(?,?) leaveDateStatus;`, [employeeDetails.userId, data.date]))[0];

      const isRestDay: boolean = restDays.includes(day) ? true : false;

      const employeeIvmsDtr = (await this.client.call<string, { companyId: string; date: Date }, IvmsEntry[]>({
        action: 'send',
        payload: { companyId: id, date: dateCurrent },
        pattern: 'get_dtr_by_company_id_and_date',
        onError: (error) => {
          throw new NotFoundException(error);
        },
      })) as IvmsEntry[];

      let hasPendingDtrCorrection = false;
      let dtrCorrection: DtrCorrection;

      const overtimeApplication = (
        await this.rawQuery(
          `
      SELECT COUNT(DISTINCT oa.overtime_application_id) otCount FROM overtime_application oa 
        INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id 
      WHERE oe.employee_id_fk = ?
      AND oa.status = 'approved' AND DATE_FORMAT(oa.planned_date,'%Y-%m-%d') = ?;
      `,
          [employeeDetails.userId, dayjs(dateCurrent).format('YYYY-MM-DD')]
        )
      )[0].otCount;

      const isOt = overtimeApplication === '0' ? false : true;

      const isHoliday = await this.holidayService.isHoliday(data.date);
      //1. check if employee is in dtr table in the current date;
      const currEmployeeDtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      const { remarks } = (
        await this.rawQuery(`SELECT get_dtr_remarks(?,?,?) remarks;`, [
          employeeDetails.userId,
          dayjs(dateCurrent).format('YYYY-MM-DD'),
          employeeDetails.companyId,
        ])
      )[0];

      //1.2 if not in current mysql daily_time_record save data fetched from ivms
      if (currEmployeeDtr === null) {
        //if schedule is regular
        await this.saveDtr(data.companyId, employeeIvmsDtr, schedule);
        //if schedule is night shift tabok2
      } else {
        if (schedule.id !== currEmployeeDtr.scheduleId)
          await this.crud().update({ dto: { scheduleId: { id: schedule.id } }, updateBy: { id: currEmployeeDtr.id } });
        if (currEmployeeDtr.hasCorrection !== true) await this.updateDtr(currEmployeeDtr, employeeIvmsDtr, schedule);
        hasPendingDtrCorrection = await this.hasPendingDtrCorrection(currEmployeeDtr.id);
        dtrCorrection = await this.getDtrCorrection(currEmployeeDtr.id);
      }
      const dtr = await this.findByCompanyIdAndDate(data.companyId, dateCurrent);
      //
      const latesUndertimesNoAttendance = await this.getLatesUndertimesNoAttendancePerDay(dtr, schedule, employeeDetails.userId);
      //const undertimes = await this.getUndertimesPerDay(dtr, schedule);

      //1.1 compute late by the day
      const { noOfLates, noOfUndertimes } = latesUndertimesNoAttendance;
      if (employeeDetails.userRole !== 'job_order') {
        if (noOfLates > 0 && !latesUndertimesNoAttendance.isHalfDay) {
          //insert to leave card ledger debit;
          //insert only if permanent or casual;
          const leaveCardItem = await this.leaveCardLedgerDebitService
            .crud()
            .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id }, dtrDeductionType: DtrDeductionType.TARDINESS } } });
          let debitValue = 0;

          if (!leaveCardItem) {
            debitValue = (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [dtr.id]))[0].debitValue;

            await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
              dailyTimeRecordId: dtr,
              debitValue,
              createdAt: dtr.dtrDate,
              dtrDeductionType: DtrDeductionType.TARDINESS,
            });
          }
          //1.2 compute undertime by the day
        }

        // if (noOfLates > 0 && latesUndertimesNoAttendance.isHalfDay) {
        //   //insert to leave card ledger debit;
        //   //insert only if permanent or casual;
        //   const leaveCardItem = await this.leaveCardLedgerDebitService
        //     .crud()
        //     .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id }, dtrDeductionType: DtrDeductionType.TARDINESS } } });
        //   let debitValue = 0;

        //   if (!leaveCardItem) {
        //     debitValue = (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [dtr.id]))[0].debitValue;

        //     await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
        //       dailyTimeRecordId: dtr,
        //       debitValue,
        //       createdAt: dtr.dtrDate,
        //       dtrDeductionType: DtrDeductionType.TARDINESS,
        //     });
        //   }
        //   //1.2 compute undertime by the day
        // }

        if (noOfUndertimes > 0) {
          const leaveCardItem = await this.leaveCardLedgerDebitService
            .crud()
            .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id }, dtrDeductionType: DtrDeductionType.UNDERTIME } } });
          let debitValue = 0;
          const passSlipCount = (
            await this.rawQuery(
              `SELECT COUNT(pass_slip_id) passSlipCount FROM pass_slip ps 
                  INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id 
                WHERE psa.status = 'approved' AND ps.nature_of_business = 'Undertime' AND DATE_FORMAT(ps.date_of_application, '%Y-%m-%d')  = ?  
                AND ps.employee_id_fk = ? AND ps.time_out IS NOT NULL;`,
              [dtr.dtrDate, employeeDetails.userId]
            )
          )[0].passSlipCount;

          if (passSlipCount === '0') {
            if (!leaveCardItem) {
              if (latesUndertimesNoAttendance.minutesUndertime > 0) {
                debitValue = latesUndertimesNoAttendance.minutesUndertime / 480;
                await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
                  dailyTimeRecordId: dtr,
                  debitValue,
                  createdAt: dtr.dtrDate,
                  dtrDeductionType: DtrDeductionType.UNDERTIME,
                });
              }
              //debitValue = (await this.rawQuery(`SELECT get_undertime_debit_value(?) debitValue;`, [dtr.id]))[0].debitValue;
            }
          }
        }

        if (latesUndertimesNoAttendance.isHalfDay) {
          const leaveCardItem = await this.leaveCardLedgerDebitService
            .crud()
            .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id }, dtrDeductionType: DtrDeductionType.HALFDAY } } });
          const debitValue = 0;
          const passSlipCount = (
            await this.rawQuery(
              `SELECT COUNT(pass_slip_id) passSlipCount FROM pass_slip ps
                  INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
                WHERE psa.status = 'approved' AND ps.nature_of_business = 'Half Day' 
                AND DATE_FORMAT(ps.date_of_application, '%Y-%m-%d')  = ? 
                AND ps.employee_id_fk = ? AND ps.time_out IS NOT NULL;`,
              [dtr.dtrDate, employeeDetails.userId]
            )
          )[0].passSlipCount;
          if (passSlipCount === '0') {
            if (!leaveCardItem) {
              await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
                dailyTimeRecordId: dtr,
                debitValue: 0.5,
                createdAt: dtr.dtrDate,
                dtrDeductionType: DtrDeductionType.HALFDAY,
              });
            }
            if (latesUndertimesNoAttendance.noOfLates > 0) {
              const leaveCardItem = await this.leaveCardLedgerDebitService
                .crud()
                .findOneOrNull({ find: { where: { dailyTimeRecordId: { id: dtr.id }, dtrDeductionType: DtrDeductionType.TARDINESS } } });
              if (!leaveCardItem) {
                await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
                  dailyTimeRecordId: dtr,
                  debitValue: latesUndertimesNoAttendance.minutesLate / 480,
                  createdAt: dtr.dtrDate,
                  dtrDeductionType: DtrDeductionType.TARDINESS,
                });
              }
            }
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
        isOt,
        hasPendingDtrCorrection,
        dtrCorrection,
        dtr: { ...dtr, remarks },
        summary,
      };
    } catch (error) {
      const dateCurrent = dayjs(data.date).toDate();
      const employeeDetails = await this.employeeScheduleService.getEmployeeDetailsByCompanyId(data.companyId);
      const schedule = (await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeDetails.userId, dateCurrent)).schedule;

      const restDays = schedule.restDaysNumbers.split(', ');
      const { leaveDateStatus } = (await this.rawQuery(`SELECT get_leave_date_status(?,?) leaveDateStatus;`, [employeeDetails.userId, data.date]))[0];

      const day = dayjs(data.date).format('d');

      const isRestDay: boolean = restDays.includes(day) ? true : false;

      const { remarks } = (
        await this.rawQuery(`SELECT get_dtr_remarks(?,?,?) remarks;`, [
          employeeDetails.userId,
          dayjs(dateCurrent).format('YYYY-MM-DD'),
          employeeDetails.companyId,
        ])
      )[0];

      const isHoliday = await this.holidayService.isHoliday(data.date);
      let noAttendance = 1;
      if ((remarks !== null && remarks !== '') || dayjs(dateCurrent).isAfter(dayjs())) {
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
          return await this.updateNightScheduleDtr(currEmployeeDtr.companyId, ivmsEntry, schedule);
        default:
          break;
      }
    }
  }

  async updateRegularWithOutLunch(currEmployeeDtr: DailyTimeRecord, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn = null;
    let _timeOut = null;
    const { timeIn, timeOut } = schedule;
    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);
    const workSuspensionStart = dayjs(await this.workSuspensionService.getWorkSuspensionStart(schedule.timeOut, currEmployeeDtr.dtrDate));
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check mo kung umaga nag in
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn))) {
            _timeIn = time;
          } else {
            //baka halfday lang siya
            if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) {
              _timeIn = time;
            } else {
              if (
                dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
                dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours === 0 ? 2 : suspensionHours, 'hour'))
              ) {
                _timeOut = time;
              }
            }
          }
        } else {
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) {
            if (_timeIn === null) _timeIn = time;
          }
          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
            dayjs(currEmployeeDtr.dtrDate + ' ' + time).isAfter(
              dayjs(suspensionHours === 0 ? currEmployeeDtr.dtrDate + ' ' + timeOut : workSuspensionStart).subtract(
                suspensionHours === 0 ? 5 : suspensionHours,
                'hour'
              )
            )
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
    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);
    const { timeIn, timeOut } = schedule;
    //const workSuspensionStart = dayjs(await this.workSuspensionService.getWorkSuspensionStart(schedule.timeOut, 'cu'));

    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check if buntag or hapon nag in
          if (
            (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
          ) {
            _timeIn = time;
          }
        } else {
          if (
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)) &&
            (dayjs().isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')))
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
    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);

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
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
            ) {
              if (suspensionHours >= 4) _timeOut = time;
              else _lunchIn = time;
            }

            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
            ) {
              if (suspensionHours >= 4) _timeOut = time;
              else _lunchOut = time;
            }
            if (
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours === 0 ? 2 : suspensionHours, 'hour'))
            ) {
              _timeOut = time;
            }
          }
        } else {
          //baka timeout or lunchout or lunchin
          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
          ) {
            if (suspensionHours >= 4) _timeOut = time;
            else _lunchOut = time;
          }

          if (
            idx !== ivmsEntry.length - 1 &&
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
            //dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut))
          ) {
            if (suspensionHours >= 4) _timeOut = time;
            else if (_lunchIn === null) _lunchIn = time;
          }

          if (
            (idx === ivmsEntry.length - 1 && dayjs('2023-01-01 ' + time).isAfter('2023-01-01 13:00:59')) ||
            ((dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')))
          ) {
            _timeOut = time;
          }

          if (
            (_timeIn && _lunchOut && _lunchIn && idx === ivmsEntry.length - 1 && dayjs('2023-01-01 ' + time).isAfter('2023-01-01 13:00:59')) ||
            ((dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) &&
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
    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);
    const workSuspensionStart = dayjs(await this.workSuspensionService.getWorkSuspensionStart(schedule.timeOut, ivmsEntry[0].date));

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
            if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) {
              _timeIn = time;
            } else {
              if (
                dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
                dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours === 0 ? 2 : suspensionHours, 'hour'))
              ) {
                _timeOut = time;
              }
            }
          }
        } else {
          if (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) {
            if (_timeIn === null) _timeIn = time;
          }

          if (
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
            dayjs(ivmsEntry[0].date + ' ' + time).isAfter(
              dayjs(suspensionHours === 0 ? ivmsEntry[0].date + ' ' + timeOut : workSuspensionStart).subtract(
                suspensionHours === 0 ? 5 : suspensionHours,
                'hour'
              )
            )
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
    let _timeIn = null;
    let _timeOut = null;

    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);

    const { timeIn, timeOut } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time } = ivmsEntryItem;
        if (
          dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 11:59:59')) &&
          (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-02 ' + timeOut).subtract(suspensionHours, 'hour')) ||
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)))
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

  async updateNightScheduleDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn = null;
    let _timeOut = null;

    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);

    const ivmsEntryTomorrow = (await this.client.call<string, { companyId: string; date: Date }, IvmsEntry[]>({
      action: 'send',
      payload: { companyId: companyId.replace('-', ''), date: dayjs(dayjs(ivmsEntry[0].date).format('YYYY-MM-DD')).add(1, 'day').toDate() },
      pattern: 'get_dtr_by_company_id_and_date',
      onError: (error) => {
        throw new NotFoundException(error);
      },
    })) as IvmsEntry[];

    const { timeIn, timeOut } = schedule;
    const resultToday = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time } = ivmsEntryItem;
        if (
          dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 11:59:59')) &&
          (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-02 ' + timeOut).subtract(suspensionHours, 'hour')) ||
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)))
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

    //timeout (silip next day morning kay nagtabok ug adlaw) 
    const resultTomorrow = await Promise.all(
      ivmsEntryTomorrow.map(async (ivmsEntryItem, idx) => {
        const { time } = ivmsEntryItem;
        const timeScan = dayjs('2023-01-01 ' + time);
        const timeOutSchedule = dayjs('2023-01-01 ' + timeOut);
        if (
          timeScan.isAfter(timeOutSchedule.subtract(suspensionHours, 'hour')) ||
          timeScan.isSame(timeOutSchedule.subtract(suspensionHours, 'hour'))
        ) {
          if (_timeOut === null)
            _timeOut = time;
        }
      })
    );

    const dtrId = await this.crudService.findOneOrNull({
      find: { where: { companyId, dtrDate: ivmsEntry[0].date } },
      onError: (error) => new InternalServerErrorException(error),
    });

    const result = await this.crudService.create({
      dto: { companyId, timeIn: _timeIn, timeOut: _timeOut, dtrDate: ivmsEntry[0].date, id: dtrId.id },
      onError: (error) => new InternalServerErrorException(error),
    });
    console.log('Nigth DTR', _timeIn, _timeOut);
    return result;
  }

  async addFrontlineShiftBDtr(companyId: string, ivmsEntry: IvmsEntry[], schedule: any) {
    let _timeIn;
    let _timeOut;

    const { timeIn, timeOut } = schedule;
    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
          //check if buntag or hapon nag in
          if (
            (dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
          ) {
            _timeIn = time;
          }
        } else {
          if (
            dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeIn)) &&
            (dayjs().isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')))
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

    const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(ivmsEntry[0].date);

    const { timeIn, timeOut, lunchOut, lunchIn } = schedule;
    const result = await Promise.all(
      ivmsEntry.map(async (ivmsEntryItem, idx) => {
        const { time, ...rest } = ivmsEntryItem;
        if (idx === 0) {
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
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
            ) {
              _lunchIn = time;
            }

            if (
              (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
                dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
            ) {
              _lunchOut = time;
            }

            if (
              dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 23:59:59')) &&
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours === 0 ? 2 : suspensionHours, 'hour'))
            ) {
              _timeOut = time;
            }
          }
        } else {
          //baka timeout or lunchout or lunchin
          if (
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchOut)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchOut))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + lunchIn)) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
          ) {
            if (suspensionHours >= 4) _timeOut = time;
            else _lunchOut = time;
          }
          if (
            idx !== ivmsEntry.length - 1 &&
            (dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + lunchIn)) ||
              dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + lunchIn))) &&
            dayjs('2023-01-01 ' + time).isBefore(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))
          ) {
            if (suspensionHours >= 4) _timeOut = time;
            else if (_lunchIn === null) _lunchIn = time;
          }
          if (
            (idx === ivmsEntry.length - 1 &&
              dayjs('2023-01-01 ' + time).isAfter('2023-01-01 13:00:59') &&
              (dayjs().isAfter(dayjs(dayjs().format('YYYY-MM-DD ') + time)) || dayjs().isSame(dayjs(dayjs().format('YYYY-MM-DD ') + time)))) ||
            ((dayjs('2023-01-01 ' + time).isSame(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour')) ||
              dayjs('2023-01-01 ' + time).isAfter(dayjs('2023-01-01 ' + timeOut).subtract(suspensionHours, 'hour'))) &&
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

    if (schedule.schedule.withLunch === 'true' || schedule.schedule.withLunch === true) {
      if (rest.lunchIn === null && rest.lunchOut === null && rest.timeIn === null && rest.timeOut === null) {
        throw new HttpException('Please fill out time scans completely', 406);
      }
    }

    const countDtrRecord = (
      await this.rawQuery(`SELECT count(daily_time_record_id) countDtrRecord FROM daily_time_record WHERE company_id_fk = ? AND dtr_date = ?`, [
        companyId,
        dtrDate,
      ])
    )[0].countDtrRecord;

    if (countDtrRecord !== '0') {
      const updateResult = await this.crud().update({
        dto: { ...rest, hasCorrection: true },
        updateBy: { companyId, dtrDate },
        onError: () => {
          return new InternalServerErrorException();
        },
      });
      if (updateResult.affected > 0) return dailyTimeRecordDto;
      else {
        throw new HttpException('No attendance found on this date', HttpStatus.NOT_ACCEPTABLE);
      }
    } else {
      return await this.crud().create({
        dto: dailyTimeRecordDto,
        onError: () => {
          return new InternalServerErrorException();
        },
      });
    }
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

  async addDtrRemarksPerEmployee(createDtrRemarksDto: CreateDtrRemarksDto) {
    const { companyId, dtrDates, remarks } = createDtrRemarksDto;

    const dtrRemarks = await Promise.all(
      dtrDates.map(async (dtrDate) => {
        const dtrId = await this.crud().findOneOrNull({ find: { select: { id: true }, where: { dtrDate, companyId } } });
        if (dtrId !== null) {
          const dtrRemarksResult = await this.crud().update({ dto: { remarks }, updateBy: { id: dtrId.id } });
          if (dtrRemarksResult.affected > 0) return { companyId, id: dtrId, dtrDate, remarks };
        }
        return await this.crudService.create({ dto: { companyId, dtrDate, remarks } });
      })
    );
    return dtrRemarks;
  }

  async updateDtrRemarksPerEmployeePerDay(updateDtrRemarksDto: UpdateDtrRemarksDto) {
    const dtrRemarksResult = await this.crud().update({ dto: { remarks: updateDtrRemarksDto.remarks }, updateBy: { id: updateDtrRemarksDto.dtrId } });
    if (dtrRemarksResult.affected > 0) return updateDtrRemarksDto;
  }

}
