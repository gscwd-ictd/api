import { Controller, Get, Param } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';
import dayjs = require('dayjs');

@Controller('leave-card-ledger-credit')
export class LeaveCardLedgerCreditController {
  constructor(private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService) {}

  @Get('test')
  async test() {
    await this.leaveCardLedgerCreditService.creditBeginningBalance();
    //await this.leaveCardLedgerCreditService.creditRecurringLeaves();
    //await this.leaveCardLedgerCreditService.creditCumulativeLeavesManually(dayjs('2025-01-01').toDate());
    await this.leaveCardLedgerCreditService.creditCumulativeLeavesManuallyWithValue(dayjs('2025-01-01').toDate(), 0);
    //await this.leaveCardLedgerCreditService.creditCumulativeLeavesManuallyWithValue(dayjs('2025-01-02').toDate(), 1.25);
    //await this.leaveCardLedgerCreditService.creditCumulativeLeaves();
  }

  @Get('credit-cumulative/:date')
  async creditCumulative(@Param('date') date: Date) {
    await this.leaveCardLedgerCreditService.creditCumulativeLeavesManually(date);
  }

  @Get('credit-cumulative-2/:date')
  async creditCumulative2(@Param('date') date: Date) {
    await this.leaveCardLedgerCreditService.creditCumulativeLeavesManuallyWithValue(date, 0);
  }
}
