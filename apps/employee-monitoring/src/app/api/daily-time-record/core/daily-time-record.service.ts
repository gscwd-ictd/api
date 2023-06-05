import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { DailyTimeRecord } from '@gscwd-api/models';
import { DtrPayload, IvmsEntry } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs = require('dayjs');
import { EmployeeScheduleService } from '../components/employee-schedule/core/employee-schedule.service';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<DailyTimeRecord> {
  constructor(
    private readonly crudService: CrudService<DailyTimeRecord>,
    private readonly client: MicroserviceClient,
    private readonly employeeScheduleService: EmployeeScheduleService
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

  async getDtrByCompanyIdAndDay(data: { companyId: string; date: Date }) {
    const id = data.companyId.replace('-', '');
    const employeeDetails = await this.employeeScheduleService.getEmployeeScheduleByCompanyId(data.companyId);

    const schedule = (await this.employeeScheduleService.getEmployeeSchedule(employeeDetails.userId)).schedule;

    const { timeIn, timeOut, lunchIn, lunchOut } = schedule;

    const employeeIvmsDtr = (await this.client.call({
      action: 'send',
      payload: { companyId: id, date: data.date },
      pattern: 'get_dtr_by_company_id_and_date',
      onError: (error) => new NotFoundException(error),
    })) as IvmsEntry[];

    //1. check if employee is in dtr table in the current date;
    const currEmployeeDtr = await this.findByCompanyIdAndDate(data.companyId, data.date);

    //1.2 if not in current mysql daily_time_record save data fetched from ivms
    if (!currEmployeeDtr) {
      //if schedule is regular
      const saveEmployeeDtr = await this.saveDtr(data.companyId, employeeIvmsDtr, schedule);
      //if schedule is night shift tabok2
    } else {
      await this.updateDtr(currEmployeeDtr, employeeIvmsDtr, schedule);
    }
    return { schedule, dtr: await this.findByCompanyIdAndDate(data.companyId, data.date) };
  }

  private async findByCompanyIdAndDate(companyId: string, dtrDate: Date) {
    return await this.crud().findOneOrNull({
      find: { where: { companyId, dtrDate } },
      onError: (error) => new InternalServerErrorException(error),
    });
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
    });
  }

  //#endregion

  async getDtrByCompanyId(companyId: string, dtrPayload: DtrPayload) {
    let dateFrom = new Date(dtrPayload.dateFrom);
    let dateTo = new Date(dtrPayload.dateTo);
    const dayDifference = (dateTo.getTime() - dateFrom.getTime()) / 86400000;
    let days = [];

    for (var i = 0; i <= dayDifference; i++) {
      let day = new Date(dateFrom.setDate(dateFrom.getDate()) + i * 86400000).toISOString().split('T')[0];
      days.push(day);
    }

    const ivmsResult: any = await this.client.call<
      string,
      object,
      { companyId: string; dtrDatesResults: { dtrDate: string; employeeDtr: { time24Hr: string; time12Hr: string }[] }[] }
    >({
      action: 'send',
      payload: { companyId, dtrDates: days },
      pattern: 'get_dtr_by_company_id',
      onError: (error) => new NotFoundException(error, { cause: new Error('') }),
    });

    const { dtrDatesResults } = ivmsResult;

    const addToLocalDTR = await Promise.all(
      dtrDatesResults.map(async (dtrDatesResult: { dtrDate: Date; employeeDtr: { time24Hr: string; time12Hr: string }[] }, idx: number) => {
        const { dtrDate, employeeDtr } = dtrDatesResult;

        if (employeeDtr.length > 0) {
          if (employeeDtr.length < 4) {
            //check pass slip
          }
        } else {
          //check leave,pass slip, travel order
        }
      })
    );
    //
    //loop per day
    //first kinsenas:  1-15
    //
    //per day check:
    //1. attendance
    //  1.1 if wala:
    //      1.1 if rest period ng schedule niya
    //      1.2 if leave niya
    //      1.3 pass slip
    //      1.4 travel
    //  1.2 if naa:
    //
    return ivmsResult;
  }
}
