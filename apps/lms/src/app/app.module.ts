import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { LspDetailsModule } from './api/lsp-details';
import { TagsModule } from './api/tags';
import { HrmsEmployeesModule } from './services/hrms/employees';
import { HrmsEmployeeTagsModule } from './services/hrms/employee-tags/core/employee-tags.module';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingDesignsModule } from './api/training-designs';
import { TrainingDetailsModule } from './api/training-details';
import { PortalEmployeesModule } from './services/portal';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    // database connection via typeorm
    DatabaseModule,

    //Api Modules

    //new learning service provider
    LspDetailsModule,

    //new trainings
    TrainingSourcesModule,
    TrainingDesignsModule,
    TrainingDetailsModule,

    //tags
    TagsModule,

    //microservice
    HrmsEmployeesModule,
    HrmsEmployeeTagsModule,

    // portal microservices
    PortalEmployeesModule,
  ],
})
export class AppModule {}
