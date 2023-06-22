import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualAward } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualAwardsService } from './lsp--individual-awards.service';
import { LspIndividualAwardsController } from './lsp-individual-awards.controller';

@Module({
  imports: [CrudModule.register(LspIndividualAward)],
  controllers: [LspIndividualAwardsController],
  providers: [LspIndividualAwardsService],
  exports: [LspIndividualAwardsService],
})
export class LspIndividualAwardsModule {}
