import { UpdateLeaveApplicationStatusDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { LeaveService } from './leave.service';

@Controller({ version: '1', path: 'leave' })
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('hr/')
  async getLeavesForHrApproval() {
    return await this.leaveService.getLeavesForHrApproval();
  }

  @Get('supervisor/:supervisor_id')
  async getLeavesUnderSupervisor(@Param('supervisor_id') supervisorId: string) {
    return await this.leaveService.getLeavesUnderSupervisor(supervisorId);
  }

  //!todo supervisor guard
  @Patch('supervisor/')
  async updateSupervisorLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationStatusDto) {
    return await this.leaveService.updateLeaveStatus(updateLeaveApplicationStatus);
  }

  //!todo hr guard
  //!todo cred
  @Patch('hr/')
  async updateHrLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationStatusDto) {
    return await this.leaveService.updateLeaveStatus(updateLeaveApplicationStatus);
  }
}
