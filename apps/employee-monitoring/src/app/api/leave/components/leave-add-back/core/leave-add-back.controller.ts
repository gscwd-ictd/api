import { Controller, Get } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';

@Controller({ version: '1', path: 'leave-add-back' })
export class LeaveAddBackController {
  constructor(private readonly leaveAddBackService: LeaveAddBackService) {}

  @Get()
  async testWorkSuspensionNow() {
    return await this.leaveAddBackService.addBackLeaveOnWorkSuspension();
  }
}
