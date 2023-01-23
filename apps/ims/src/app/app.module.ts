import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { SERVICES_MODULES } from '../constants';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ims/.env') }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    ...SERVICES_MODULES,
  ],
})
export class AppModule {}
