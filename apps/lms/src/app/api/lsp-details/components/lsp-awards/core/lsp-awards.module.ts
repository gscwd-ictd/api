import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LspAwardsService } from './lsp-awards.service';
import { LspAward } from '@gscwd-api/models';
import { LspAwardsController } from './lsp-awards.controller';

@Module({
  imports: [CrudModule.register(LspAward)],
  controllers: [LspAwardsController],
  providers: [LspAwardsService],
  exports: [LspAwardsService],
})
export class LspAwardsModule {}
