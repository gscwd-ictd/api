import { Module } from '@nestjs/common';
import { EmployeesModule } from '../../employees/core/employees.module';
import { LeaveAddBackModule } from '../components/leave-add-back/core/leave-add-back.module';
import { LeaveApplicationDatesModule } from '../components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../components/leave-benefits/core/leave-benefits.module';
import { LeaveCardLedgerCreditModule } from '../components/leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { LeaveCardLedgerDebitModule } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.module';
import { LeaveCreditDeductionsModule } from '../components/leave-credit-deductions/core/leave-credit-deductions.module';
import { LeaveCreditEarningsModule } from '../components/leave-credit-earnings/core/leave-credit-earnings.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { LeaveMsController } from './leave-ms.controller';

@Module({
  imports: [
    LeaveApplicationModule,
    LeaveApplicationDatesModule,
    LeaveBenefitsModule,
    LeaveCreditEarningsModule,
    LeaveCreditDeductionsModule,
    LeaveCardLedgerDebitModule,
    LeaveCardLedgerCreditModule,
    LeaveAddBackModule,
    EmployeesModule,
  ],
  providers: [LeaveService],
  controllers: [LeaveController, LeaveMsController],
  exports: [
    LeaveApplicationModule,
    LeaveApplicationDatesModule,
    LeaveBenefitsModule,
    LeaveCreditEarningsModule,
    LeaveCardLedgerDebitModule,
    LeaveCardLedgerCreditModule,
    LeaveCreditEarningsModule,
    LeaveCreditDeductionsModule,
  ],
})
export class LeaveModule {}
