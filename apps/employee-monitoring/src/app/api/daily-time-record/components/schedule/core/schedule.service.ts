import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Schedule, CreateScheduleDto, ScheduleRestDay, UpdateScheduleDto } from '@gscwd-api/models';
import { ScheduleBase } from '@gscwd-api/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ScheduleService extends CrudHelper<Schedule> {
  constructor(private readonly crudService: CrudService<Schedule>, private dataSource: DataSource) {
    super(crudService);
  }

  async addSchedule(scheduleServiceDto: CreateScheduleDto) {
    const scheduleResult = await this.dataSource.transaction(async (transactionEntityManager) => {
      const { restDays, ...rest } = scheduleServiceDto;
      const schedule = await transactionEntityManager.getRepository(Schedule).save(rest);
      const scheduleRestDays = await Promise.all(
        restDays.map(async (scheduleRestDay) => {
          console.log(scheduleRestDay);
          return await transactionEntityManager.getRepository(ScheduleRestDay).save({ restDay: scheduleRestDay, scheduleId: schedule });
        })
      );
      return { schedule, scheduleRestDays };
    });
    return scheduleResult;
  }

  async getSchedules(scheduleBase: ScheduleBase) {
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
      shift 
    FROM schedule  WHERE schedule_base = ?
    `,
      [scheduleBase]
    );

    const schedulesWithRestDays = await Promise.all(
      schedules.map(async (schedule) => {
        const restDays = await this.rawQuery<string, ScheduleRestDay[]>(`SELECT rest_day restDay FROM schedule_rest_day WHERE schedule_id_fk = ? `, [
          schedule.id,
        ]);

        const restDaysResult = await Promise.all(
          restDays.map(async (restDay: ScheduleRestDay) => {
            return parseInt(restDay.restDay.toString());
          })
        );
        return { ...schedule, restDays: restDaysResult };
      })
    );

    console.log(schedulesWithRestDays);

    return schedulesWithRestDays;
  }

  async deleteSchedule(scheduleId: string) {
    const deletedScheduleRestDays = await this.rawQuery(`DELETE FROM schedule_rest_day WHERE schedule_id_fk=?`, [scheduleId]);
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
    const updateScheduleResult = await this.dataSource.transaction(async (transactionEntityManager) => {
      const { id, restDays, withLunch, ...rest } = updateScheduleDto;

      const updateSchedule = await transactionEntityManager.getRepository(Schedule).update(id, rest);

      if (updateSchedule.affected > 0) {
        const deleteRestDays = await transactionEntityManager
          .getRepository(ScheduleRestDay)
          .query(`DELETE FROM schedule_rest_day WHERE schedule_id_fk = ?`, [id]);
        const updateResult = await Promise.all(
          restDays.map(async (restDay) => {
            const replacementRestDays = await transactionEntityManager.getRepository(ScheduleRestDay).save({ restDay, scheduleId: { id } });
            const { scheduleId, ...rest } = replacementRestDays;
            return { ...rest, scheduleId: scheduleId.id };
          })
        );
        return {
          schedule: { id, ...rest },
          scheduleRestdays: updateResult,
        };
      }
    });
    return updateScheduleResult;
  }
}
