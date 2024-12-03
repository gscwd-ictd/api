import { CreateLeaveApplicationDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LeaveApplicationGuard } from '../misc/leave-application.guard';
import { LeaveApplicationService } from './leave-application.service';
import { Throttle } from '@nestjs/throttler';

@Controller({ version: '1', path: '/leave-application' })
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  @UseGuards(LeaveApplicationGuard)
  @Throttle({ default: { limit: 1, ttl: 3000 } })
  @Post()
  async addLeaveApplication(@Body() createLeaveApplicationDto: CreateLeaveApplicationDto) {
    return await this.leaveApplicationService.createLeaveApplication(createLeaveApplicationDto);
  }

  @Get('details/:employee_id/:leave_application_id')
  async getLeaveApplicationDetails(@Param('employee_id') employeeId: string, @Param('leave_application_id') leaveApplicationId: string) {
    return await this.leaveApplicationService.getLeaveApplicationDetails(leaveApplicationId, employeeId);
  }

  @Get(':employee_id')
  async getLeaveApplicationByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.leaveApplicationService.getLeaveApplicationByEmployeeId(employeeId);
  }

  @Get('unavailable-dates/:employee_id')
  async getUnavailableDates(@Param('employee_id') employeeId: string) {
    return await this.leaveApplicationService.getUnavailableDates(employeeId);
  }

  @Get('supervisor/:supervisor_id')
  async getLeavesUnderSupervisor(@Param('supervisor_id') supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }
}
