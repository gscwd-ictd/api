import { Module } from '@nestjs/common';
import { GeneralLedgerContraAccountTypeService } from './general-ledger-contra-account-type.service';
import { GeneralLedgerContraAccountTypeController } from './general-ledger-contra-account-type.controller';
import { CrudModule } from '@gscwd-api/crud';
import { GeneralLedgerContraAccountType } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(GeneralLedgerContraAccountType)],
  controllers: [GeneralLedgerContraAccountTypeController],
  providers: [GeneralLedgerContraAccountTypeService],
  exports: [GeneralLedgerContraAccountTypeService],
})
export class GeneralLedgerContraAccountTypeModule {}
