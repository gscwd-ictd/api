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
}
