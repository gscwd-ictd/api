import { Module } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';
import { LeaveAddBackController } from './leave-add-back.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveAddBack } from '@gscwd-api/models';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { WorkSuspensionModule } from '../../../../work-suspension/core/work-suspension.module';
import { LeaveCardLedgerCreditModule } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.module';

@Module({
  imports: [CrudModule.register(LeaveAddBack), EmployeesModule, WorkSuspensionModule, LeaveCardLedgerCreditModule],
  providers: [LeaveAddBackService],
  controllers: [LeaveAddBackController],
  exports: [LeaveAddBackService],
})
export class LeaveAddBackModule {}
