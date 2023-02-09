import { Module } from '@nestjs/common';
import { AccountGroupService } from './account-groups.service';
import { AccountGroupController } from './account-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { AccountGroup } from '../data/account-groups.entity';

@Module({
  imports: [CrudModule.register(AccountGroup)],
  controllers: [AccountGroupController],
  providers: [AccountGroupService],
  exports: [AccountGroupService],
})
export class AccountGroupModule {}
