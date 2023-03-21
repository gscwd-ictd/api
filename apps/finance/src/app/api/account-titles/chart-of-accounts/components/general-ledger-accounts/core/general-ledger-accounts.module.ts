import { Module } from '@nestjs/common';
import { GeneralLedgerAccountService } from './general-ledger-accounts.service';
import { GeneralLedgerAccountController } from './general-ledger-accounts.controller';
import { CrudModule } from '@gscwd-api/crud';
import { GeneralLedgerAccount } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(GeneralLedgerAccount)],
  controllers: [GeneralLedgerAccountController],
  providers: [GeneralLedgerAccountService],
  exports: [GeneralLedgerAccountService],
})
export class GeneralLedgerAccountModule {}
