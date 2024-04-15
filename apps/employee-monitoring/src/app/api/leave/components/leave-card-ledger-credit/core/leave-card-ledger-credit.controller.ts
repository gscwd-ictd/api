import { Controller, Get, Param } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';

@Controller('leave-card-ledger-credit')
export class LeaveCardLedgerCreditController {
  constructor(private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService) {}

  @Get('test')
  async test() {
    await this.leaveCardLedgerCreditService.creditBeginningBalance();
    await this.leaveCardLedgerCreditService.creditRecurringLeaves();
    await this.leaveCardLedgerCreditService.creditCumulativeLeaves();
  }

  @Get('credit-cumulative/:date')
  async creditCumulative(@Param('date') date: Date) {
    await this.leaveCardLedgerCreditService.creditCumulativeLeavesManually(date);
  }
}
