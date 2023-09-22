import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { LspDetailsModule } from './api/lsp-details';
import { TagsModule } from './api/tags';
import { EmployeesModule } from './services/employees';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    // database connection via typeorm
    DatabaseModule,

    //Api Modules

    //lsp
    // LspIndividualDetailsModule,
    // LspOrganizationDetailsModule,

    // //trainings
    // TrainingSourcesModule,
    // TrainingTypesModule,

    // //trainings
    // TrainingDesignsModule,
    // //TrainingDetailsModule,
    // //TrainingDetailsTestModule,

    // //tags
    // TagsModule,

    //new learning service provider
    LspDetailsModule,

    //tags
    TagsModule,

    //microservice
    EmployeesModule,
    //EmployeeTagsModule,
  ],
})
export class AppModule {}
