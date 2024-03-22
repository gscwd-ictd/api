import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Schedule, CreateScheduleDto, UpdateScheduleDto } from '@gscwd-api/models';
import { ScheduleBase } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GroupScheduleType } from '../../schedule-sheet/misc/schedule-sheet.types';
import dayjs = require('dayjs');

@Injectable()
export class ScheduleService extends CrudHelper<Schedule> {
  constructor(private readonly crudService: CrudService<Schedule>, private readonly dataSource: DataSource) {
    super(crudService);
  }

  async addSchedule(scheduleServiceDto: CreateScheduleDto) {
    return await this.crud().create({ dto: scheduleServiceDto, onError: () => new InternalServerErrorException() });
  }

  async getScheduleById(id: string) {
    return await this.crud().findOne({ find: { where: { id } } });
  }

  async getSchedulesDropDown() {
    const schedules = await this.rawQuery<ScheduleBase, Schedule[]>(
      `
    SELECT 
      schedule_id id, 
      name, 
      schedule_type scheduleType, 
      time_in timeIn, 
      time_out timeOut, 
      lunch_in lunchIn, 
      lunch_out lunchOut, 
      schedule_base scheduleBase,
      shift 
    FROM schedule ORDER BY name ASC;
    `
    );

    const schedulesDropDown = await Promise.all(
      schedules.map(async (schedule) => {
        const { name, createdAt, deletedAt, updatedAt, ...rest } = schedule;
        return { label: name, value: { name, ...rest } };
      })
    );

    return schedulesDropDown;
  }

  async getSchedules(scheduleBase: ScheduleBase | null) {
    let schedules;

    if (!scheduleBase) {
      schedules = (await this.rawQuery<ScheduleBase, Schedule[]>(
        `
      SELECT 
        schedule_id id, 
        name, 
        schedule_type scheduleType, 
        time_in timeIn, 
        time_out timeOut, 
        lunch_in lunchIn, 
        lunch_out lunchOut, 
        schedule_base scheduleBase,
        shift,
        is_with_lunch withLunch
      FROM schedule ORDER BY name ASC;
      `
      )) as Schedule[];
    } else {
      schedules = (await this.rawQuery<ScheduleBase, Schedule[]>(
        `
      SELECT 
        schedule_id id, 
        name, 
        schedule_type scheduleType, 
        time_in timeIn, 
        time_out timeOut, 
        lunch_in lunchIn, 
        lunch_out lunchOut, 
        schedule_base scheduleBase,
        shift,
        is_with_lunch withLunch 
      FROM schedule WHERE schedule_base = ? ORDER BY name ASC;
      `,
        [scheduleBase]
      )) as Schedule[];
    }

    return schedules;
  }

  async deleteSchedule(scheduleId: string) {
    //check if schedule is currently in use (daily_time_record)
    const dtrEntry = await this.hasDtrByScheduleId(scheduleId);
    const hasEmployeeSchedule = await this.hasEmployeeScheduleByScheduleId(scheduleId);
    if (dtrEntry) throw new HttpException('Schedule is currently being used for DTR', HttpStatus.METHOD_NOT_ALLOWED);
    if (hasEmployeeSchedule) throw new HttpException('Schedule is currently being used as Employee Schedule', HttpStatus.METHOD_NOT_ALLOWED);

    const deletedSchedule = await this.crud().delete({
      deleteBy: { id: scheduleId },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (deletedSchedule.affected > 0) return { deleted: scheduleId };
  }

  async updateSchedule(updateScheduleDto: UpdateScheduleDto) {
    const { id, ...rest } = updateScheduleDto;

    const updateSchedule = await this.crud().update({ dto: rest, updateBy: { id }, onError: () => new InternalServerErrorException() });
    if (updateSchedule.affected > 0) return updateScheduleDto;
  }

  async deleteGroupSchedule(groupSchedule: GroupScheduleType) {
    /*
    1. delete schedule 
       SELECT es.employee_id_fk employeeId 
         FROM employee_schedule es 
       INNER JOIN custom_group_members cgm ON es.employee_id_fk = cgm.employee_id_fk 
       WHERE date_from=? AND date_to=? AND schedule_id_fk=?
    */
    console.log(groupSchedule);
    const { customGroupId, dateFrom, dateTo, scheduleId } = groupSchedule;
    //2. delete employees from custom group where scheduleId,dateFrom,dateTo

    const employeeIds = (await this.rawQuery(
      `SELECT DISTINCT es.employee_id_fk employeeId 
      FROM employee_schedule es 
     INNER JOIN custom_groups cg ON cg.custom_group_id = es.custom_group_id_fk
     WHERE date_from=? AND date_to=? AND schedule_id_fk=? AND es.custom_group_id_fk = ?`,
      [dateFrom, dateTo, scheduleId, customGroupId]
    )) as { employeeId: string }[];

    if (employeeIds.length === 0 || typeof employeeIds === 'undefined') {
      console.log('asd as');
      throw new HttpException('There are no employees in this schedule.', 404);
    }

    const employeeIdsArray = (await Promise.all(
      employeeIds.map(async (employeeId) => {
        return employeeId.employeeId;
      })
    )) as string[];

    console.log('employees:', employeeIdsArray);

    //console.log(employeeIdsArray);
    // const deleteEmployeeCustomGroupResult = (await this.rawQuery(
    //   `DELETE FROM custom_group_members WHERE custom_group_id_fk = ? AND employee_id_fk IN (?);`,
    //   [customGroupId, employeeIdsArray]
    //));

    const deleteEmployeeCustomGroupResult = (await this.rawQuery(
      `DELETE FROM employee_schedule WHERE employee_id_fk IN (?) AND date_format(date_from, '%Y-%m-%d') = ? and date_format(date_to, '%Y-%m-%d') = ? AND schedule_id_fk = ? AND custom_group_id_fk = ?;`,
      [employeeIdsArray, dateFrom, dateTo, scheduleId, customGroupId]
    )) as { affectedRows: number };

    console.log('affected: ', deleteEmployeeCustomGroupResult.affectedRows);

    const { countRestDays } = (
      await this.rawQuery(
        `SELECT COUNT(*) countRestDays FROM employee_rest_day WHERE employee_id_fk IN (?) AND date_format(date_from, '%Y-%m-%d')=? AND date_format(date_to, '%Y-%m-%d') = ?;`,
        [employeeIdsArray, dateFrom, dateTo]
      )
    )[0];

    console.log(countRestDays);
    //delete rest day/rest days
    if (parseInt(countRestDays) > 0) {
      await this.rawQuery(
        `DELETE FROM employee_rest_days WHERE employee_rest_day_id_fk IN (SELECT employee_rest_day_id FROM employee_rest_day WHERE employee_id_fk IN (?) 
       AND date_from=? AND date_to = ?
      );`,
        [employeeIdsArray, dateFrom, dateTo]
      );

      await this.rawQuery(`DELETE FROM employee_rest_day WHERE employee_id_fk IN (?) AND date_from=? AND date_to = ?;`, [
        employeeIdsArray,
        dateFrom,
        dateTo,
      ]);
    }

    console.log(deleteEmployeeCustomGroupResult);

    console.log(deleteEmployeeCustomGroupResult.affectedRows);
    if (deleteEmployeeCustomGroupResult.affectedRows > 0) return groupSchedule;
    else throw new InternalServerErrorException();
  }

  async hasDtrByScheduleId(scheduleId: string) {
    const hasDtr = (
      await this.rawQuery(`SELECT IF(count(dtr.schedule_id_fk) > 0, true, false) hasDtr FROM daily_time_record dtr WHERE dtr.schedule_id_fk = ?;`, [
        scheduleId,
      ])
    )[0].hasDtr;

    if (hasDtr === '0') return false;
    return true;
  }

  async hasEmployeeScheduleByScheduleId(scheduleId: string) {
    const hasEmployeeSchedule = (
      await this.rawQuery(`SELECT IF(count(schedule_id_fk)>0, true, false) hasEmployeeSchedule FROM employee_schedule WHERE schedule_id_fk = ?;`, [
        scheduleId,
      ])
    )[0].hasEmployeeSchedule;
    if (hasEmployeeSchedule === '0') return false;
  }
}
