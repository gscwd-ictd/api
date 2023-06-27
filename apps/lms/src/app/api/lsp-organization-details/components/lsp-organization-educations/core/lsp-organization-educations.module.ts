import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationEducation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationEducationsService } from './lsp-organization-educations.service';
import { LspOrganizationEducationsController } from './lsp-organization-educations.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationEducation)],
  controllers: [LspOrganizationEducationsController],
  providers: [LspOrganizationEducationsService],
  exports: [LspOrganizationEducationsService],
})
export class LspOrganizationEducationsModule {}
