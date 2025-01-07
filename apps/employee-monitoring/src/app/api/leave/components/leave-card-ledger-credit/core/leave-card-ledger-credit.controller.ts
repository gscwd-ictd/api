import { Controller, Get, Param, Post } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';
import dayjs = require('dayjs');

@Controller('leave-card-ledger-credit')
export class LeaveCardLedgerCreditController {
  constructor(private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService) {}

  /**
   * 2025-01-07
   * This function is a temporary fix for 2025 Beginning Balance.
   * The CRON Job did not execute properly due to this reasons:
   *  1. No rest periods found for January because there were no schedules set for employees for 2025
   *  2. There were adjustments done to the stored procedure for the ledger generation
   * Note: The stored procedure for this was adjusted as well (LIMIT 23, 999999999)
   */
  @Post('credit-beginning-balance')
  async creditBeginningBalance() {
    await this.leaveCardLedgerCreditService.creditBeginningBalance();
    //await this.leaveCardLedgerCreditService.creditRecurringLeaves(); //commented out because the recurring leaves were credited previous month for the fix
    await this.leaveCardLedgerCreditService.creditCumulativeLeavesManuallyWithValue(dayjs('2025-01-01').toDate(), 0);
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
