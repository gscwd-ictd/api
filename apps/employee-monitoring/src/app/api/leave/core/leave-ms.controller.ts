import { Controller } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateLeaveApplicationHrdmStatusDto } from '@gscwd-api/models';
import dayjs = require('dayjs');

@Controller()
export class LeaveMsController {
  constructor(private readonly leaveService: LeaveService) {}

  @MessagePattern('get_leave_for_hrdm_approval')
  async getForHrdmApprovalCount() {
    return await this.leaveService.getForHrdmApprovalCount();
  }

  @MessagePattern('update_hrdm_leave_approval_status')
  async updateHrdmLeaveApprovalStatus(@Payload() updateLeaveApplicationStatus: UpdateLeaveApplicationHrdmStatusDto) {
    return await this.leaveService.updateLeaveStatus({ ...updateLeaveApplicationStatus, hrdmApprovalDate: dayjs().toDate() });
  }
}
