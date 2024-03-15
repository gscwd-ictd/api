import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaveApplicationDatesService } from './leave-application-dates.service';
import { AuthenticatedGuard } from '../../../../users/guards/authenticated.guard';

@Controller({ version: '1', path: 'leave-application-dates' })
export class LeaveApplicationDatesController {
  constructor(private readonly leaveApplicationDatesService: LeaveApplicationDatesService) {}

  //@UseGuards(AuthenticatedGuard)
  @Get('/for-cancellation/')
  async getForApprovalLeaveDates() {
    return await this.leaveApplicationDatesService.getForApprovalLeaveDates();
  }
}
