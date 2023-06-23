import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualEducation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualEducationsController } from './lsp-individual-educations.controller';
import { LspIndividualEducationsService } from './lsp-individual-educations.service';

@Module({
  imports: [CrudModule.register(LspIndividualEducation)],
  controllers: [LspIndividualEducationsController],
  providers: [LspIndividualEducationsService],
  exports: [LspIndividualEducationsService],
})
export class LspIndividualEducationsModule {}
