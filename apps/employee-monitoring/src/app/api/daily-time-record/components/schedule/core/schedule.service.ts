import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Schedule, ScheduleDto, ScheduleRestDay } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService extends CrudHelper<Schedule> {
  constructor(private readonly crudService: CrudService<Schedule>) {
    super(crudService);
  }

  async addSchedule(scheduleServiceDto: ScheduleDto) {
    const repo = this.crudService.getDatasource();
    const scheduleResult = await repo.transaction(async (transactionEntityManager) => {
      const { restDays, ...rest } = scheduleServiceDto;
      const schedule = await transactionEntityManager.getRepository(Schedule).save(rest);
      const scheduleRestDays = await Promise.all(
        restDays.map(async (scheduleRestDay) => {
          return await transactionEntityManager.getRepository(ScheduleRestDay).save({ ...scheduleRestDay, scheduleId: schedule });
        })
      );
      return { schedule, scheduleRestDays };
    });
    return scheduleResult;
  }

  async getSchedules() {
    const schedules = await this.rawQuery(`
    SELECT 
      schedule_id id, 
      name, 
      schedule_type scheduleType, 
      time_in timeIn, 
      time_out timeOut, 
      lunch_in lunchIn, 
      lunch_out lunchOut, 
      shift
    FROM schedule 
    `);

    const schedulesWithRestDays = await Promise.all(
      schedules.map(async (schedule) => {
        const restDays = await this.rawQuery(`SELECT rest_day restDay FROM schedule_rest_day WHERE schedule_id_fk = ? `, [schedule.id]);

        const restDaysResult = await Promise.all(
          restDays.map(async (restDay) => {
            return parseInt(restDay.restDay);
          })
        );
        return { ...schedule, restDays: restDaysResult };
      })
    );

    return schedulesWithRestDays;
  }
}
