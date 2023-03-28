import { CreateLeaveApplicationDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';

@Controller({ version: '1', path: '/leave-application' })
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  @Post()
  async addLeaveApplication(@Body() createLeaveApplicationDto: CreateLeaveApplicationDto) {
    return await this.leaveApplicationService.createLeaveApplication(createLeaveApplicationDto);
  }

  @Get(':employee_id')
  async getLeaveApplicationByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.leaveApplicationService.getLeaveApplicationByEmployeeId(employeeId);
  }

  @Get('details/:leave_application_id')
  async getLeaveApplicationDetails(@Param('leave_application_id') leaveApplicationId: string) {
    return await this.leaveApplicationService.getLeaveApplicationDetails(leaveApplicationId);
  }

  @Get('unavailable-dates/:employee_id')
  async getUnavailableDates(@Param('employee_id') employeeId: string) {
    return await this.leaveApplicationService.getUnavailableDates(employeeId);
  }
}
