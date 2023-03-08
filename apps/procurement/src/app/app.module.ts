import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections/';
import { API_MODULES } from '../utils/constants';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/procurement/.env') }),

    DatabaseModule,

    ...API_MODULES,
  ],
})
export class AppModule {}
