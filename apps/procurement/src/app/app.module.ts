import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ConnectionModule } from '../database/connection/connection.module';
import { API_MODULES } from '../utils/constants';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/procurement/.env') }),

    ConnectionModule,

    ...API_MODULES,
  ],
})
export class AppModule {}
