import { Module } from '@nestjs/common';
import { LspIndividualAffiliationsModule } from '../components/lsp-individual-affiliations';
import { LspIndividualAwardsModule } from '../components/lsp-individual-awards';
import { LspEducationsModule } from '../components/lsp-educations';
import { LspProjectsModule } from '../components/lsp-projects';
import { LspTrainingsModule } from '../components/lsp-trainings';
import { LspIndividualCertificationsModule } from '../components/lsp-individual-certifications';
import { LspCoachingsModule } from '../components/lsp-coachings';
import { CrudModule } from '@gscwd-api/crud';
import { LspDetails } from '@gscwd-api/models';
import { LspIndividualDetailsService } from './lsp-individual-details.service';
import { LspIndividualDetailsController } from './lsp-individual-details.controller';

@Module({
  imports: [
    CrudModule.register(LspDetails),
    LspIndividualAffiliationsModule,
    LspIndividualAwardsModule,
    LspIndividualCertificationsModule,
    LspCoachingsModule,
    LspEducationsModule,
    LspProjectsModule,
    LspTrainingsModule,
  ],
  controllers: [LspIndividualDetailsController],
  providers: [LspIndividualDetailsService],
  exports: [LspIndividualDetailsService],
})
export class LspIndividualDetailsModule {}
