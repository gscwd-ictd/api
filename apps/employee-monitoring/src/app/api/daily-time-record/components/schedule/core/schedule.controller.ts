import { ScheduleDto } from '@gscwd-api/models';
import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller({ version: '1', path: 'schedule' })
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async addSchedule(@Body() scheduleDto: ScheduleDto) {
    return await this.scheduleService.addSchedule(scheduleDto);
  }
}
