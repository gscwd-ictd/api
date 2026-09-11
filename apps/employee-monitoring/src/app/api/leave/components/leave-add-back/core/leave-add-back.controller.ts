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
    await this.leaveAddBackService.addBackLeaveOnWorkSuspensionV2();
    return { message: 'Add-back for work suspension executed' };
  }
}
