import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualProject } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualProjectsController } from './lsp-individual-projects.controller';
import { LspIndividualProjectsService } from './lsp-individual-projects.service';

@Module({
  imports: [CrudModule.register(LspIndividualProject)],
  controllers: [LspIndividualProjectsController],
  providers: [LspIndividualProjectsService],
  exports: [LspIndividualProjectsService],
})
export class LspIndividualProjectsModule {}
