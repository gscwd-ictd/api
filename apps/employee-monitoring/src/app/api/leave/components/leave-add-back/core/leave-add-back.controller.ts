import { Controller, Get, Param } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';

@Controller({ version: '1', path: 'leave-add-back' })
export class LeaveAddBackController {
  constructor(private readonly leaveAddBackService: LeaveAddBackService) {}

  @Get(':dtr_date')
  async testWorkSuspensionNow(@Param('dtr_date') dtrDate: Date) {
    //return await this.leaveAddBackService.addBackLeaveOnWorkSuspensionV2();
    return await this.leaveAddBackService.addBackLeaveOnWorkSuspension(dtrDate);
  }
}
