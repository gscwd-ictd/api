import { Module } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';
import { LeaveCardLedgerCreditController } from './leave-card-ledger-credit.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveCardLedgerCredit } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveCardLedgerCredit)],
  providers: [LeaveCardLedgerCreditService],
  controllers: [LeaveCardLedgerCreditController],
  exports: [LeaveCardLedgerCreditService],
})
export class LeaveCardLedgerCreditModule {}
