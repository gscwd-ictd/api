import { Module } from '@nestjs/common';
import { AccountGroupsModule } from '../components/account-groups';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts.service';

@Module({
  imports: [AccountGroupsModule],
  providers: [ChartOfAccountsService],
  controllers: [ChartOfAccountsController],
})
export class ChartOfAccountsModule {}
