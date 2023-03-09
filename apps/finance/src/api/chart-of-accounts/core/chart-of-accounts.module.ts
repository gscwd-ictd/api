import { CrudModule } from '@gscwd-api/crud';
import { ChartOfAccountsView } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { AccountGroupModule } from '../components/account-groups';
import { GeneralLedgerAccountModule } from '../components/general-ledger-accounts';
import { MajorAccountGroupModule } from '../components/major-account-groups';
import { SubMajorAccountGroupModule } from '../components/sub-major-account-groups';
import { ChartOfAccountController } from './chart-of-accounts.controller';
import { ChartOfAccountService } from './chart-of-accounts.service';

@Module({
  imports: [
    CrudModule.register(ChartOfAccountsView),
    AccountGroupModule,
    MajorAccountGroupModule,
    SubMajorAccountGroupModule,
    GeneralLedgerAccountModule,
  ],
  providers: [ChartOfAccountService],
  controllers: [ChartOfAccountController],
})
export class ChartOfAccountModule {}
