import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualAffiliation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualAffiliationsService } from './lsp-individual-affiliations.service';
import { LspIndividualAffiliationsController } from './lsp-individual-affiliations.controller';

@Module({
  imports: [CrudModule.register(LspIndividualAffiliation)],
  controllers: [LspIndividualAffiliationsController],
  providers: [LspIndividualAffiliationsService],
  exports: [LspIndividualAffiliationsService],
})
export class LspIndividualAffiliationsModule {}
