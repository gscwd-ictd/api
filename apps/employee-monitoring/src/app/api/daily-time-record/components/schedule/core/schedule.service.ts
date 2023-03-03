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

  async getSchedules(schedule_id: string) {
    return schedule_id;
  }
}
