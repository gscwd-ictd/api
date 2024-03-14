import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LspAwardsService } from './lsp-awards.service';
import { LspAward } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LspAward)],
  controllers: [],
  providers: [LspAwardsService],
  exports: [LspAwardsService],
})
export class LspAwardsModule {}
