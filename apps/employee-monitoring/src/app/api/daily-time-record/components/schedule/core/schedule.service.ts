import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Schedule, CreateScheduleDto, UpdateScheduleDto } from '@gscwd-api/models';
import { ScheduleBase } from '@gscwd-api/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ScheduleService extends CrudHelper<Schedule> {
  constructor(private readonly crudService: CrudService<Schedule>, private dataSource: DataSource) {
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
}
