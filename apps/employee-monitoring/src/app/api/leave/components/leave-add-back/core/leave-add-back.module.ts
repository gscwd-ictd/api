import { Module } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';
import { LeaveAddBackController } from './leave-add-back.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveAddBack } from '@gscwd-api/models';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { WorkSuspensionModule } from '../../../../work-suspension/core/work-suspension.module';
import { LeaveCardLedgerCreditModule } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { EmployeeScheduleModule } from '../../../../daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { LeaveCreditEarningsModule } from '../../leave-credit-earnings/core/leave-credit-earnings.module';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';
import { LeaveCreditDeductionsModule } from '../../leave-credit-deductions/core/leave-credit-deductions.module';
import { LeaveCardLedgerDebitModule } from '../../leave-card-ledger-debit/core/leave-card-ledger-debit.module';

@Module({
  imports: [
    CrudModule.register(LeaveAddBack),
    EmployeesModule,
    WorkSuspensionModule,
    LeaveCardLedgerCreditModule,
    EmployeesModule,
    EmployeeScheduleModule,
    LeaveCreditEarningsModule,
    LeaveBenefitsModule,
    LeaveCreditDeductionsModule,
    LeaveCardLedgerDebitModule,
  ],
  providers: [LeaveAddBackService],
  controllers: [LeaveAddBackController],
  exports: [LeaveAddBackService],
})
export class LeaveAddBackModule {}
