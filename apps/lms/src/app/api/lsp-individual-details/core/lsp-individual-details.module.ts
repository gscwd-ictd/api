import { Module } from '@nestjs/common';
import { LspIndividualAffiliationsModule } from '../components/lsp-individual-affiliations';
import { LspIndividualCertificationsModule } from '../components/lsp-individual-certifications';
import { LspIndividualCoachingsModule } from '../components/lsp-individual-coachings';
import { LspIndividualAwardsModule } from '../components/lsp-individual-awards';
import { LspIndividualEducationsModule } from '../components/lsp-individual-educations';
import { LspIndividualProjectsModule } from '../components/lsp-individual-projects';
import { LspIndividualTrainingsModule } from '../components/lsp-individual-trainings';
import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualDetails } from '@gscwd-api/models';
import { LspIndividualDetailsService } from './lsp-individual-details.service';
import { LspIndividualDetailsController } from './lsp-individual-details.controller';

@Module({
  imports: [
    CrudModule.register(LspIndividualDetails),
    LspIndividualAffiliationsModule,
    LspIndividualAwardsModule,
    LspIndividualCertificationsModule,
    LspIndividualCoachingsModule,
    LspIndividualEducationsModule,
    LspIndividualProjectsModule,
    LspIndividualTrainingsModule,
  ],
  controllers: [LspIndividualDetailsController],
  providers: [LspIndividualDetailsService],
  exports: [LspIndividualDetailsService],
})
export class LspIndividualDetailsModule {}
