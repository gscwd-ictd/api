import { CrudModule } from '@gscwd-api/crud';
import { LspDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspDetailsService } from './lsp-details.service';
import { LspDetailsController } from './lsp-details.controller';
import { LspAffiliationsModule } from '../components/affiliations';
import { LspAwardsModule } from '../components/awards';
import { LspCertificationsModule } from '../components/certifications';
import { LspCoachingsModule } from '../components/coachings';
import { LspEducationsModule } from '../components/educations';
import { LspProjectsModule } from '../components/projects';
import { LspTrainingsModule } from '../components/trainings';
import { PortalEmployeesModule } from '../../../services/portal';

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
    PortalEmployeesModule,
  ],
  controllers: [LspDetailsController],
  providers: [LspDetailsService],
  exports: [LspDetailsService],
})
export class LspDetailsModule {}
