import { Controller, Get } from '@nestjs/common';
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
}
