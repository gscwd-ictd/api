import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { LspDetailsModule } from './api/lsp-details';
import { TagsModule } from './api/tags';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingDesignsModule } from './api/training-designs';
import { TrainingDetailsModule } from './api/training-details';
import { PortalEmployeesModule } from './services/portal';
import { HrmsEmployeeTagsModule, HrmsEmployeesModule, HrmsUsersModule } from './services/hrms';
import { TrainingNoticesModule } from './api/training-notices';
import { TrainingNomineesModule } from './api/training-details/components/training-nominees';
import { TrainingApprovalsModule } from './api/training-details/components/training-approvals';
import { LspAffiliationsModule } from './api/lsp-details/components/affiliations';
import { LspAwardsModule } from './api/lsp-details/components/awards';
import { LspCertificationsModule } from './api/lsp-details/components/certifications';
import { LspCoachingsModule } from './api/lsp-details/components/coachings';
import { LspEducationsModule } from './api/lsp-details/components/educations';
import { LspProjectsModule } from './api/lsp-details/components/projects';
import { LspTrainingsModule } from './api/lsp-details/components/trainings';

@Module({
  imports: [
    /* config module setup for reading env variables */
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    /* database connection via typeorm */
    DatabaseModule,

    /* learning service provider */
    LspDetailsModule,
    LspAffiliationsModule,
    LspAwardsModule,
    LspCertificationsModule,
    LspCoachingsModule,
    LspEducationsModule,
    LspProjectsModule,
    LspTrainingsModule,

    //new trainings
    TrainingSourcesModule,
    TrainingDesignsModule,
    TrainingDetailsModule,
    TrainingNoticesModule,
    TrainingNomineesModule,
    TrainingApprovalsModule,
    //tags
    TagsModule,

    //hrms microservice
    HrmsEmployeesModule,
    HrmsEmployeeTagsModule,
    HrmsUsersModule,

    // portal microservices
    PortalEmployeesModule,
  ],
})
export class AppModule {}
