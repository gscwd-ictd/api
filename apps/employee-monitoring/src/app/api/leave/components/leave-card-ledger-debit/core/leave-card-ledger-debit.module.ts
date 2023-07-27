import { Module } from '@nestjs/common';
import { LeaveCardLedgerDebitService } from './leave-card-ledger-debit.service';
import { LeaveCardLedgerDebitController } from './leave-card-ledger-debit.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveCardLedgerDebit } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveCardLedgerDebit)],
  providers: [LeaveCardLedgerDebitService],
  controllers: [LeaveCardLedgerDebitController],
  exports: [LeaveCardLedgerDebitService],
})
export class LeaveCardLedgerDebitModule {}
