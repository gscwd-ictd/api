import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { TrainingSourcesModule } from './api/training-sources';
import { TrainingTypesModule } from './api/training-types';
import { LspDetailsModule } from './api/lsp-details';
import { TrainingsModule } from './api/trainings';
import { ManagersModule } from './services/managers';
import { EmployeesModule } from './services/employees';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    // database connection via typeorm
    DatabaseModule,

    //Api Modules
    LspDetailsModule,
    TrainingsModule,
    TrainingSourcesModule,
    TrainingTypesModule,
    ManagersModule,
    EmployeesModule,
  ],
})
export class AppModule {}
