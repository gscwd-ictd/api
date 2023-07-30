import { Module } from '@nestjs/common';
import { LeaveAddBackModule } from '../components/leave-add-back/core/leave-add-back.module';
import { LeaveApplicationDatesModule } from '../components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../components/leave-benefits/core/leave-benefits.module';
import { LeaveCardLedgerCreditModule } from '../components/leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { LeaveCardLedgerDebitModule } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.module';
import { LeaveCreditEarningsModule } from '../components/leave-credit-earnings/core/leave-credit-earnings.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

@Module({
  imports: [
    LeaveApplicationModule,
    LeaveApplicationDatesModule,
    LeaveBenefitsModule,
    LeaveCreditEarningsModule,
    LeaveCardLedgerDebitModule,
    LeaveCardLedgerCreditModule,
    LeaveAddBackModule,
  ],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [
    LeaveApplicationModule,
    LeaveApplicationDatesModule,
    LeaveBenefitsModule,
    LeaveCreditEarningsModule,
    LeaveCardLedgerDebitModule,
    LeaveCardLedgerCreditModule,
    LeaveAddBackModule,
  ],
})
export class LeaveModule {}
