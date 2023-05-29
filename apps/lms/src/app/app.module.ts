import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { TrainingSourcesModule } from './api/training-sources';
import { VenueDetailsModule } from './api/venue-details';
import { TrainingTypesModule } from './api/training-types';
import { LspDetailsModule } from './api/lsp-details/core/lsp-details.module';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }),

    // database connection via typeorm
    DatabaseModule,

    //Api Modules
    LspDetailsModule,
    TrainingSourcesModule,
    TrainingTypesModule,
    VenueDetailsModule,
  ],
})
export class AppModule {}
