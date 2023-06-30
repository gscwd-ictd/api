import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationAffiliation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationAffiliationsService } from './lsp-organization-affiliations.service';
import { LspOrganizationAffiliationsController } from './lsp-organization-affiliations.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationAffiliation)],
  controllers: [LspOrganizationAffiliationsController],
  providers: [LspOrganizationAffiliationsService],
  exports: [LspOrganizationAffiliationsService],
})
export class LspOrganizationAffiliationsModule {}
