import { EmployeeScheduleDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';

@Controller({ version: '1', path: 'employee-schedule' })
export class EmployeeScheduleController {
  constructor(private readonly employeeScheduleService: EmployeeScheduleService) {}

  @Post()
  async addEmployeeSchedule(@Body() employeeScheduleDto: EmployeeScheduleDto) {
    return await this.employeeScheduleService.addEmployeeSchedule(employeeScheduleDto);
  }

  @Get(':employee_id')
  async getEmployeeSchedule(@Param('employee_id') employeeId: string) {
    return await this.employeeScheduleService.getEmployeeSchedule(employeeId);
  }
}
