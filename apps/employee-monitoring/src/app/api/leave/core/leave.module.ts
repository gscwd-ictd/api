import { LeaveCardLedgerDebit } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LeaveApplicationDatesModule } from '../components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../components/leave-benefits/core/leave-benefits.module';
import { LeaveCardLedgerDebitModule } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.module';
import { LeaveCreditEarningsModule } from '../components/leave-credit-earnings/core/leave-credit-earnings.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

@Module({
  imports: [LeaveApplicationModule, LeaveApplicationDatesModule, LeaveBenefitsModule, LeaveCreditEarningsModule, LeaveCardLedgerDebitModule],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveApplicationModule, LeaveApplicationDatesModule, LeaveBenefitsModule, LeaveCreditEarningsModule, LeaveCardLedgerDebitModule],
})
export class LeaveModule {}
