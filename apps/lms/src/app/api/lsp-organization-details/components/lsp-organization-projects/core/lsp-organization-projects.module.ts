import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationProject } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationProjectsService } from './lsp-organization-projects.service';
import { LspOrganizationProjectsController } from './lsp-organization-projects.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationProject)],
  controllers: [LspOrganizationProjectsController],
  providers: [LspOrganizationProjectsService],
  exports: [LspOrganizationProjectsService],
})
export class LspOrganizationProjectsModule {}
