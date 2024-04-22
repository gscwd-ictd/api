import { Controller } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LeaveMsController {
  constructor(private readonly leaveService: LeaveService) {}

  @MessagePattern('get_leave_for_hrdm_approval')
  async getForHrdmApprovalCount() {
    return await this.leaveService.getForHrdmApprovalCount();
  }
}
