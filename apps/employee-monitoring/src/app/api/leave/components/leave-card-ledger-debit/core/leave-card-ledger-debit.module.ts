import { forwardRef, Module } from '@nestjs/common';
import { LeaveCardLedgerDebitService } from './leave-card-ledger-debit.service';
import { LeaveCardLedgerDebitController } from './leave-card-ledger-debit.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveCardLedgerDebit } from '@gscwd-api/models';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { LeaveCreditDeductionsModule } from '../../leave-credit-deductions/core/leave-credit-deductions.module';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';
import { LeaveApplicationModule } from '../../leave-application/core/leave-application.module';
import { HolidaysModule } from '../../../../holidays/core/holidays.module';

@Module({
  imports: [
    CrudModule.register(LeaveCardLedgerDebit),
    EmployeesModule,
    LeaveCreditDeductionsModule,
    LeaveBenefitsModule,
    forwardRef(() => HolidaysModule),
  ],
  providers: [LeaveCardLedgerDebitService],
  controllers: [LeaveCardLedgerDebitController],
  exports: [LeaveCardLedgerDebitService],
})
export class LeaveCardLedgerDebitModule {}
