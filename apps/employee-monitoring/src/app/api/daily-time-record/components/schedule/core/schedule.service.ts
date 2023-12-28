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
    const { customGroupId, dateFrom, dateTo, scheduleId } = groupSchedule;
    //2. delete employees from custom group where scheduleId,dateFrom,dateTo
    const employeeIds = (await this.rawQuery(
      `SELECT es.employee_id_fk employeeId 
         FROM employee_schedule es 
       INNER JOIN custom_groups cg ON es.custom_group_id_fk = cg.custom_group_id 
       WHERE date_from=? AND date_to=? AND schedule_id_fk=?`,
      [dateFrom, dateTo, scheduleId]
    )) as { employeeId: string }[];

    if (employeeIds.length === 0) throw new HttpException('There are no employees in this schedule.', 404);

    const employeeIdsArray = (await Promise.all(
      employeeIds.map(async (employeeId) => {
        return employeeId.employeeId;
      })
    )) as string[];

    //console.log(employeeIdsArray);
    // const deleteEmployeeCustomGroupResult = (await this.rawQuery(
    //   `DELETE FROM custom_group_members WHERE custom_group_id_fk = ? AND employee_id_fk IN (?);`,
    //   [customGroupId, employeeIdsArray]
    //))

    const deleteEmployeeCustomGroupResult = (await this.rawQuery(
      `DELETE FROM employee_schedule WHERE employee_id_fk IN (?) AND date_from = ? and date_to = ? AND schedule_id_fk = ? AND custom_group_id_fk=?;`,
      [employeeIdsArray, dateFrom, dateTo, scheduleId, customGroupId]
    )) as { affectedRows: number };

    //delete rest day/rest days
    await this.rawQuery(
      `DELETE FROM employee_rest_days WHERE employee_rest_day_id_fk IN (SELECT employee_rest_day_id FROM employee_rest_day WHERE employee_id_fk IN (?));`,
      [employeeIdsArray]
    );

    await this.rawQuery(`DELETE FROM employee_rest_day WHERE employee_id_fk IN (?);`, [employeeIdsArray]);
    //const restDay = await this.employeeRestDayService.crud().findOneBy({findBy:{ dateFrom: dayjs(dateFrom).toDate(),dateTo: dayjs(dateTo).toDate(),employeeId}})

    console.log(deleteEmployeeCustomGroupResult);
    //
    console.log(deleteEmployeeCustomGroupResult.affectedRows);
    if (deleteEmployeeCustomGroupResult.affectedRows > 0) return groupSchedule;
    else throw new InternalServerErrorException();
  }
}
