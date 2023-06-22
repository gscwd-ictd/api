import { CrudModule } from '@gscwd-api/crud';
import { LspProject } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspProjectsController } from './lsp-projects.controller';
import { LspProjectsService } from './lsp-projects.service';

@Module({
  imports: [CrudModule.register(LspProject)],
  controllers: [LspProjectsController],
  providers: [LspProjectsService],
  exports: [LspProjectsService],
})
export class LspProjectsModule {}
