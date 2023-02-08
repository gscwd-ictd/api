import { Module } from '@nestjs/common';
import { AccountGroupsService } from './account-groups.service';
import { AccountGroupsController } from './account-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { AccountGroup } from '../data/account-groups.entity';

@Module({
  imports: [CrudModule.register(AccountGroup)],
  controllers: [AccountGroupsController],
  providers: [AccountGroupsService],
  exports: [AccountGroupsService],
})
export class AccountGroupsModule {}
