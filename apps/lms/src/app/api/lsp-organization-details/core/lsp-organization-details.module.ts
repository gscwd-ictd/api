import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationDetailsService } from './lsp-organization-details.service';
import { LspOrganizationDetailsController } from './lsp-organization-details.controller';
import { LspOrganizationAffiliationsModule } from '../components/lsp-organization-affiliations';
import { LspOrganizationAwardsModule } from '../components/lsp-organization-awards';
import { LspOrganizationCertificationsModule } from '../components/lsp-organization-certifications';
import { LspOrganizationCoachingsModule } from '../components/lsp-organization-coachings';
import { LspOrganizationEducationsModule } from '../components/lsp-organization-educations';

@Module({
  imports: [
    CrudModule.register(LspOrganizationDetails),
    LspOrganizationAffiliationsModule,
    LspOrganizationAwardsModule,
    LspOrganizationCertificationsModule,
    LspOrganizationCoachingsModule,
    LspOrganizationEducationsModule,
  ],
  controllers: [LspOrganizationDetailsController],
  providers: [LspOrganizationDetailsService],
  exports: [LspOrganizationDetailsService],
})
export class LspOrganizationDetailsModule {}
