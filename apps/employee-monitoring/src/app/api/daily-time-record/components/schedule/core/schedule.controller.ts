import { ScheduleDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller({ version: '1', path: 'schedule' })
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async addSchedule(@Body() scheduleDto: ScheduleDto) {
    return await this.scheduleService.addSchedule(scheduleDto);
  }

  @Get(':schedule_id')
  async getSchedule(@Param('schedule_id') scheduleId: string) {}
}
