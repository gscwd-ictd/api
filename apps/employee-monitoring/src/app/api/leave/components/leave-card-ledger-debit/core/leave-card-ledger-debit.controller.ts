import { CreateLeaveCardLedgerDebitDto } from '@gscwd-api/models';
import { Body, Controller, forwardRef, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
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

  /** Manual run (same as the Dec 7 job). Safe to re-run: employees already forfeited are skipped. */
  @Post('forfeiture/forced-wellness/:year')
  async forfeitureOfForcedAndWellnessLeave(@Param('year', ParseIntPipe) year: number) {
    return await this.leaveCardLedgerDebitService.forfeitureOfForcedAndWellnessLeave(year);
  }

  /** Manual run (same as the Jan 7 job) for the SPL of `year`. Safe to re-run. */
  @Post('forfeiture/spl/:year')
  async forfeitureOfSpecialPrivilegeLeave(@Param('year', ParseIntPipe) year: number) {
    return await this.leaveCardLedgerDebitService.forfeitureOfSpecialPrivilegeLeave(year);
  }
}
