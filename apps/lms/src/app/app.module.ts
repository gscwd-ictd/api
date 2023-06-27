import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingTypesModule } from './api/training-types';
import { LspIndividualDetailsModule } from './api/lsp-individual-details';
import { TrainingsModule } from './api/trainings';
import { ManagersModule } from './services/managers';
import { EmployeesModule } from './services/employees';
import { LspSourcesModule } from './api/lsp-sources';
import { TagsModule } from './api/tags';

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

    //trainings
    TrainingsModule,
    TrainingSourcesModule,
    TrainingTypesModule,

    //tags
    TagsModule,

    //microservice
    ManagersModule,
    EmployeesModule,
  ],
})
export class AppModule {}
