import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualCoaching } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualCoachingsController } from './lsp-individual-coachings.controller';
import { LspIndividualCoachingsService } from './lsp-individual-coachings.service';

@Module({
  imports: [CrudModule.register(LspIndividualCoaching)],
  controllers: [LspIndividualCoachingsController],
  providers: [LspIndividualCoachingsService],
  exports: [LspIndividualCoachingsService],
})
export class LspIndividualCoachingsModule {}
