import { CreateScheduleDto, UpdateScheduleDto } from '@gscwd-api/models';
import { ScheduleBase } from '@gscwd-api/utils';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller({ version: '1', path: 'schedules' })
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async addSchedule(@Body() scheduleDto: CreateScheduleDto) {
    return await this.scheduleService.addSchedule(scheduleDto);
  }

  @Get()
  async getSchedules(@Query('base') scheduleBase: ScheduleBase) {
    return await this.scheduleService.getSchedules(scheduleBase);
  }

  @Get('/dropdown')
  async getSchedulesDropDown() {
    return await this.scheduleService.getSchedulesDropDown();
  }

  @Get(':schedule_id')
  async getSchedule(@Param('schedule_id') scheduleId: string) {
    return await this.scheduleService.getScheduleById(scheduleId);
  }

  @Put()
  async updateSchedule(@Body() updateScheduleDto: UpdateScheduleDto) {
    return await this.scheduleService.updateSchedule(updateScheduleDto);
  }

  @Delete(':schedule_id')
  async deleteSchedule(@Param('schedule_id') scheduleId: string) {
    return await this.scheduleService.deleteSchedule(scheduleId);
  }
}
