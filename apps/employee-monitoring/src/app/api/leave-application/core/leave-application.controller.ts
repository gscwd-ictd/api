import { Controller, Post } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';

@Controller({ version: '1', path: '/leave-application' })
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  @Post()
  async addLeaveApplication() {
    //return await this.leaveApplicationService.findAll();
  }
}
