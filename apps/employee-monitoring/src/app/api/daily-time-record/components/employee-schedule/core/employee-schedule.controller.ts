import { CreateEmployeeScheduleByGroupDto, CreateEmployeeScheduleDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';

@Controller({ version: '1', path: 'employee-schedule' })
export class EmployeeScheduleController {
  constructor(private readonly employeeScheduleService: EmployeeScheduleService) {}

  @Post()
  async addEmployeeSchedule(@Body() employeeScheduleDto: CreateEmployeeScheduleDto) {
    return await this.employeeScheduleService.addEmployeeSchedule(employeeScheduleDto);
  }

  @Get(':employee_id')
  async getEmployeeSchedule(@Param('employee_id') employeeId: string) {
    return await this.employeeScheduleService.getEmployeeSchedule(employeeId);
  }

  @Post('group')
  async addEmployeeScheduleByGroup(@Body() employeeScheduleByGroupDto: CreateEmployeeScheduleByGroupDto) {
    return await this.employeeScheduleService.addEmployeeScheduleByGroup(employeeScheduleByGroupDto);
  }

  @Get(':custom_group_id')
  async getEmployeeScheduleByGroupId(@Param('custom_group_id') customGroupId: string) {
    return '';
  }
}
