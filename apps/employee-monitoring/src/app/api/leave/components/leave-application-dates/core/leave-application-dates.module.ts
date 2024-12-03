import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplicationDates } from '@gscwd-api/models';
import { LeaveApplicationDatesController } from './leave-application-dates.controller';
import { LeaveApplicationDatesService } from './leave-application-dates.service';
import { LeaveAddBackModule } from '../../leave-add-back/core/leave-add-back.module';
import { LeaveCardLedgerCreditModule } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { LeaveCreditEarningsModule } from '../../leave-credit-earnings/core/leave-credit-earnings.module';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';

@Module({
  imports: [
    CrudModule.register(LeaveApplicationDates),
    LeaveAddBackModule,
    LeaveCardLedgerCreditModule,
    EmployeesModule,
    LeaveBenefitsModule,
    LeaveCreditEarningsModule,
  ],
  providers: [LeaveApplicationDatesService],
  controllers: [LeaveApplicationDatesController],
  exports: [LeaveApplicationDatesService],
})
export class LeaveApplicationDatesModule {}
