import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationCertification } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationCertificationsService } from './lsp-organization-certifications.service';
import { LspOrganizationCertificationsController } from './lsp-organization-certifications.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationCertification)],
  controllers: [LspOrganizationCertificationsController],
  providers: [LspOrganizationCertificationsService],
  exports: [LspOrganizationCertificationsService],
})
export class LspOrganizationCertificationsModule {}
