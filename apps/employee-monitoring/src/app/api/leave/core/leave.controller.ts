import {
  LeaveDateCancellationDto,
  UpdateLeaveApplicationEmployeeStatus,
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import dayjs = require('dayjs');
import { LeaveAdjustmentDto } from '../data/leave-adjustment.dto';
import { LeaveService } from './leave.service';
import { User } from '../../users/utils/user.decorator';
import { AuthenticatedGuard } from '../../users/guards/authenticated.guard';
import { AuthenticatedUser } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'leave' })
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) { }

  @Get('hrmo/:year_month')
  async getLeavesForHrApprovalByYearMonth(@Param('year_month') yearMonth: string) {
    return await this.leaveService.getLeavesForHrmoApprovalByYearMonth(yearMonth);
  }

  @Get('hrmo/')
  async getLeavesForHrApproval() {
    return await this.leaveService.getLeavesForHrmoApproval();
  }

  @Get('supervisor/:supervisor_id')
  async getLeavesUnderSupervisor(@Param('supervisor_id') supervisorId: string) {
    return await this.leaveService.getLeavesUnderSupervisor(supervisorId);
  }

  @Get('supervisor/v2/:supervisor_id')
  async getLeavesUnderSupervisorV2(@Param('supervisor_id') supervisorId: string) {
    return await this.leaveService.getLeavesUnderSupervisorV2(supervisorId);
  }

  @Get('hrdm/')
  async getLeavesForHrmdApproval() {
    return await this.leaveService.getLeavesForHrdmApprovalV2();
  }

  //!todo supervisor guard
  @Patch('supervisor/')
  async updateSupervisorLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationSupervisorStatusDto) {
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, supervisorApprovalDate: dayjs().toDate() });
  }

  //!todo hrmo guard
  //!todo cred
  @UseGuards(AuthenticatedGuard)
  @Patch('hrmo/')
  async updateHrmoLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationHrmoStatusDto, @User() user: AuthenticatedUser) {
    const userId = user._id;
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, hrmoApprovedBy: userId, hrmoApprovalDate: dayjs().toDate() });
  }

  //!todo hrdm guard
  @Patch('hrdm/')
  async updateHrmdLeaveStatus(@Body() updateLeaveApplicationStatus: UpdateLeaveApplicationHrdmStatusDto) {
    return await this.leaveService.updateLeaveStatus({
      ...updateLeaveApplicationStatus,
      hrdmApprovalDate: dayjs().toDate(),
    });
  }

  @Patch('employee/leave-date-cancellation/')
  async cancelLeaveDate(@Body() LeaveDateCancellationDto: LeaveDateCancellationDto) {
    return await this.leaveService.cancelLeaveDate(LeaveDateCancellationDto);
  }

  @Get('ledger/:employee_id/:company_id/:year')
  async getLeaveLedger(@Param('employee_id') employeeId: string, @Param('company_id') companyId: string, @Param('year') year: number) {
    return await this.leaveService.getLeaveLedger(employeeId, companyId, year);
  }

  @Patch('employee')
  async cancelLeave(@Body() updateLeaveApplicationEmployeeStatus: UpdateLeaveApplicationEmployeeStatus) {
    return await this.leaveService.cancelLeave(updateLeaveApplicationEmployeeStatus);
  }

  @Post('adjustment')
  async addAdjustment(@Body() leaveAdjustmentDto: LeaveAdjustmentDto) {
    return await this.leaveService.addAdjustment(leaveAdjustmentDto);
  }

  @Post('adjustment/beginning-balance')
  async addAdjustmentBeginningBalance(@Body() leaveAdjustmentDto: LeaveAdjustmentDto) {
    return await this.leaveService.addAdjustment(leaveAdjustmentDto);
  }
}
