import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { API_MODULES } from '../constants';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ams/.env') }),

    // database config for connecting to ams database
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    ...API_MODULES,
  ],
})
export class AppModule {}
