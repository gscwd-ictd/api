import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingTypesModule } from './api/training-types';
import { LspIndividualDetailsModule } from './api/lsp-individual-details';
import { TrainingIndividualDetailsModule } from './api/training-individual-details';
import { EmployeesModule } from './services/employees';
import { LspSourcesModule } from './api/lsp-sources';
import { TagsModule } from './api/tags';
import { LspOrganizationDetailsModule } from './api/lsp-organization-details';
import { EmployeeTagsModule } from './services/employee-tags/core/employee-tags.module';
import { TrainingOrganizationDetailsModule } from './api/training-organization-details';

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

    //trainings individual
    TrainingIndividualDetailsModule,

    //training organization
    TrainingOrganizationDetailsModule,

    //tags
    TagsModule,

    //microservice
    EmployeesModule,
    EmployeeTagsModule,
  ],
})
export class AppModule {}
