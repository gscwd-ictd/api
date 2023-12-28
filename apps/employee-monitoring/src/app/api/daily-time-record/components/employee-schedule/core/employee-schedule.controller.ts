import { CreateEmployeeScheduleByGroupDto, CreateEmployeeScheduleDto, DeleteEmployeeScheduleDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Get(':employee_id/all')
  async getAllEmployeeSchedules(@Param('employee_id') employeeId: string) {
    return await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);
  }

  @Post('group')
  async addEmployeeScheduleByGroup(@Body() employeeScheduleByGroupDto: CreateEmployeeScheduleByGroupDto) {
    console.log('Route For Posting Schedule Group');
    return await this.employeeScheduleService.addEmployeeScheduleByGroup(employeeScheduleByGroupDto);
  }

  @Delete()
  async deleteEmployeeSchedule(@Body() employeeScheduleDto: DeleteEmployeeScheduleDto) {
    return await this.employeeScheduleService.deleteEmployeeSchedule(employeeScheduleDto);
  }

  @Get(':custom_group_id')
  async getEmployeeScheduleByGroupId(@Param('custom_group_id') customGroupId: string) {
    return '';
  }
}
