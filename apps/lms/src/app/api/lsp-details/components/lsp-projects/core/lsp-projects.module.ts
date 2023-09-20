import { CrudModule } from '@gscwd-api/crud';
import { LspProject } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspProjectsService } from './lsp-projects.service';
import { LspProjectsController } from './lsp-projects.controller';

@Module({
  imports: [CrudModule.register(LspProject)],
  controllers: [LspProjectsController],
  providers: [LspProjectsService],
  exports: [LspProjectsService],
})
export class LspProjectsModule {}
