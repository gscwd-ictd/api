import {
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import dayjs = require('dayjs');
import { LeaveService } from './leave.service';

@Controller({ version: '1', path: 'leave' })
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('hrmo/')
  async getLeavesForHrApproval() {
    return await this.leaveService.getLeavesForHrmoApproval();
  }

  @Get('supervisor/:supervisor_id')
  async getLeavesUnderSupervisor(@Param('supervisor_id') supervisorId: string) {
    return await this.leaveService.getLeavesUnderSupervisor(supervisorId);
  }

  @Get('hrdm/')
  async getLeavesForHrmdApproval() {
    return await this.leaveService.getLeavesForHrdmApproval();
  }

  //!todo supervisor guard
  @Patch('supervisor/')
  async updateSupervisorLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationSupervisorStatusDto) {
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, supervisorApprovalDate: dayjs().toDate() });
  }

  //!todo hrmo guard
  //!todo cred
  @Patch('hrmo/')
  async updateHrmoLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationHrmoStatusDto) {
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, hrmoApprovalDate: dayjs().toDate() });
  }

  //!todo hrdm guard
  @Patch('hrdm/')
  async updateHrmdLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationHrdmStatusDto) {
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, hrdmApprovalDate: dayjs().toDate() });
  }

  @Get('ledger/:employee_id/:company_id')
  async getLeaveLedger(@Param('employee_id') employeeId: string, @Param('company_id') companyId: string) {
    return await this.leaveService.getLeaveLedger(employeeId, companyId);
  }
}
