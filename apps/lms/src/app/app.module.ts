import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingTypesModule } from './api/training-types';
import { LspIndividualDetailsModule } from './api/lsp-individual-details';
import { TrainingDetailsModule } from './api/training-details';
import { EmployeesModule } from './services/employees';
import { LspSourcesModule } from './api/lsp-sources';
import { TagsModule } from './api/tags';
import { LspOrganizationDetailsModule } from './api/lsp-organization-details';
import { EmployeeTagsModule } from './services/employee-tags/core/employee-tags.module';
import { TrainingDetailsTestModule } from './api/training-details-test/core/training-details-test.module';
import { TrainingDesignsModule } from './api/training-designs';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    // database connection via typeorm
    DatabaseModule,

    //Api Modules

    //lsp
    LspSourcesModule,
    LspIndividualDetailsModule,
    LspOrganizationDetailsModule,

    //trainings
    TrainingSourcesModule,
    TrainingTypesModule,

    //trainings
    TrainingDesignsModule,
    //TrainingDetailsModule,
    //TrainingDetailsTestModule,

    //tags
    TagsModule,

    //microservice
    EmployeesModule,
    EmployeeTagsModule,
  ],
})
export class AppModule {}
