import { CrudModule } from '@gscwd-api/crud';
import { LspProject } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspProjectsService } from './lsp-projects.service';

@Module({
  imports: [CrudModule.register(LspProject)],
  controllers: [],
  providers: [LspProjectsService],
  exports: [LspProjectsService],
})
export class LspProjectsModule {}
