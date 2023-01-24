import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { APP_MODULES } from '../constants/modules';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/items/.env') }),

    // database connection using typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    ...APP_MODULES,
  ],
})
export class AppModule {}
