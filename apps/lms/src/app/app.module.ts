import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { LspDetailsModule } from './api/lsp-details';
import { LspAffiliationsModule } from './api/lsp-details/components/affiliations';
import { LspAwardsModule } from './api/lsp-details/components/awards';
import { LspCertificationsModule } from './api/lsp-details/components/certifications';
import { LspCoachingsModule } from './api/lsp-details/components/coachings';
import { LspEducationsModule } from './api/lsp-details/components/educations';
import { LspProjectsModule } from './api/lsp-details/components/projects';
import { LspTrainingsModule } from './api/lsp-details/components/trainings';
import { TagsModule } from './api/tags';
import { HrmsEmployeeTagsModule, HrmsEmployeesModule, HrmsUsersModule } from './services/hrms';
import { PortalEmployeesModule } from './services/portal';
import { TrainingSourcesModule } from './api/training/components/sources';
import { TrainingDesignsModule } from './api/training/components/designs';
import { TrainingDetailsModule } from './api/training';
import { TrainingLspDetailsModule } from './api/training/components/lsp';
import { TrainingTagsModule } from './api/training/components/tags';
import { TrainingDistributionsModule } from './api/training/components/slot-distributions';
import { TrainingRecommendedEmployeesModule } from './api/training/components/recommended-employees';
import { TrainingNomineesModule } from './api/training/components/nominees';
import { TrainingApprovalsModule } from './api/training/components/approvals';
import { TrainingRequirementsModule } from './api/training/components/requirements';
import { StatsModule } from './api/stats';
import { BenchmarkModule } from './api/benchmark';
import { BenchmarkParticipantsModule } from './api/benchmark/components/participants';

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

    /* tag */
    TagsModule,

    /* hrms microservice */
    HrmsEmployeesModule,
    HrmsEmployeeTagsModule,
    HrmsUsersModule,

    /* portal microservices */
    PortalEmployeesModule,

    /* trainings */
    TrainingSourcesModule,
    TrainingDesignsModule,

    TrainingDetailsModule,
    TrainingLspDetailsModule,
    TrainingTagsModule,
    TrainingDistributionsModule,
    TrainingRecommendedEmployeesModule,
    TrainingNomineesModule,
    TrainingApprovalsModule,
    TrainingRequirementsModule,

    /* stats */
    StatsModule,

    /* benchmark */
    BenchmarkModule,
    BenchmarkParticipantsModule,
  ],
})
export class AppModule {}
