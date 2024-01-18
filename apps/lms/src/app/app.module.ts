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
import { HrmsEmployeeTagsModule, HrmsEmployeesModule } from './services/hrms';
import { TrainingNoticesModule } from './api/training-notices';
import { TrainingNomineesModule } from './api/training-details/components/training-nominees';

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
    TrainingNoticesModule,
    TrainingNomineesModule,
    //tags
    TagsModule,

    //hrms microservice
    HrmsEmployeesModule,
    HrmsEmployeeTagsModule,

    // portal microservices
    PortalEmployeesModule,
  ],
})
export class AppModule {}
