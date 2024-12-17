import { Controller, UseFilters } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UpdateLeaveApplicationHrdmStatusDto, UpdateLeaveApplicationSupervisorStatusDto } from '@gscwd-api/models';
import dayjs = require('dayjs');
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller()
export class LeaveMsController {
  constructor(private readonly leaveService: LeaveService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_leave_for_hrdm_approval')
  async getForHrdmApprovalCount() {
    try {
      return await this.leaveService.getForHrdmApprovalCount();
    }
    catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('update_hrdm_leave_approval_status')
  async updateHrdmLeaveApprovalStatus(@Payload() updateLeaveApplicationStatus: UpdateLeaveApplicationHrdmStatusDto) {
    try {
      return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, hrdmApprovalDate: dayjs().toDate() });
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }
}
