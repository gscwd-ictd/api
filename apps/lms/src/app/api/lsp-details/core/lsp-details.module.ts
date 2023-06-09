import { Module } from '@nestjs/common';
import { LspAffiliationsModule } from '../components/lsp-affiliations';
import { LspAwardsModule } from '../components/lsp-awards';
import { LspEducationsModule } from '../components/lsp-educations';
import { LspProjectsModule } from '../components/lsp-projects';
import { LspTrainingsModule } from '../components/lsp-trainings';
import { LspCertificationsModule } from '../components/lsp-certifications';
import { LspCoachingsModule } from '../components/lsp-coachings';
import { CrudModule } from '@gscwd-api/crud';
import { LspDetails } from '@gscwd-api/models';
import { LspDetailsService } from './lsp-details.service';
import { LspDetailsController } from './lsp-details.controller';

@Module({
  imports: [
    CrudModule.register(LspDetails),
    LspAffiliationsModule,
    LspAwardsModule,
    LspCertificationsModule,
    LspCoachingsModule,
    LspEducationsModule,
    LspProjectsModule,
    LspTrainingsModule,
  ],
  controllers: [LspDetailsController],
  providers: [LspDetailsService],
  exports: [LspDetailsService],
})
export class LspDetailsModule {}
