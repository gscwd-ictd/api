import { CreateLeaveCardLedgerDebitDto } from '@gscwd-api/models';
import { Body, Controller, Post } from '@nestjs/common';
import { LeaveCardLedgerDebitService } from './leave-card-ledger-debit.service';

@Controller({ path: 'leave-card-ledger-debit', version: '1' })
export class LeaveCardLedgerDebitController {
  constructor(private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService) {}

  @Post()
  async addLeaveCardLedgerDebit(@Body() leaveCardLedgerDebitDto: CreateLeaveCardLedgerDebitDto) {
    return await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit(leaveCardLedgerDebitDto);
  }
}
