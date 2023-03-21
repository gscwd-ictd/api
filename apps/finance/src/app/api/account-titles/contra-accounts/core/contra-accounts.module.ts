import { Module } from '@nestjs/common';
import { ContraAccountService } from './contra-accounts.service';
import { ContraAccountController } from './contra-accounts.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ContraAccount } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(ContraAccount)],
  controllers: [ContraAccountController],
  providers: [ContraAccountService],
  exports: [ContraAccountService],
})
export class ContraAccountModule {}
