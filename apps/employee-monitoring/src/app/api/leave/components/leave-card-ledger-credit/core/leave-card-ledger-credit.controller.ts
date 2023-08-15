import { Controller, Get } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';

@Controller('leave-card-ledger-credit')
export class LeaveCardLedgerCreditController {
  constructor(private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService) {}

  @Get('test')
  async test() {
    return this.leaveCardLedgerCreditService.creditBeginningBalance();
  }
}
