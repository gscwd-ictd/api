import { CreateLeaveCardLedgerDebitDto } from '@gscwd-api/models';
import { Body, Controller, forwardRef, Get, Inject, Post } from '@nestjs/common';
import { LeaveCardLedgerDebitService } from './leave-card-ledger-debit.service';
import dayjs = require('dayjs');
import { HolidaysService } from '../../../../holidays/core/holidays.service';

@Controller({ path: 'leave-card-ledger-debit', version: '1' })
export class LeaveCardLedgerDebitController {
  constructor(
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    @Inject(forwardRef(() => HolidaysService))
    private readonly holidaysService: HolidaysService
  ) {}

  @Post()
  async addLeaveCardLedgerDebit(@Body() leaveCardLedgerDebitDto: CreateLeaveCardLedgerDebitDto) {
    return await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit(leaveCardLedgerDebitDto);
  }

  @Get('')
  async forceForfeitureOfForcedLeave() {
    return await this.leaveCardLedgerDebitService.forfeitureOfForcedLeave();
  }
}
