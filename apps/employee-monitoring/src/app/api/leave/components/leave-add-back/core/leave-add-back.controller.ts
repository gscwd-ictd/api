import { Controller, Get, Param, Post } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';

@Controller({ version: '1', path: 'leave-add-back' })
export class LeaveAddBackController {
  constructor(private readonly leaveAddBackService: LeaveAddBackService) {}

  // @Get(':dtr_date')
  // async testWorkSuspensionNow(@Param('dtr_date') dtrDate: Date) {
  //   // return await this.leaveAddBackService.addBackLeaveOnWorkSuspensionV2();
  //   return await this.leaveAddBackService.addBackLeaveOnWorkSuspension(dtrDate);
  // }

  @Post('run-add-back-work-suspension')
  async runAddBackManually() {
    // same as the nightly cron: LEGACY (V3) + WHOLE_DAY / TIME_OF_DAY suspensions (idempotent)
    await this.leaveAddBackService.scheduledAddBackLeaveOnWorkSuspension();
    return { message: 'Add-back for work suspension executed' };
  }
}
