import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';
import { API_MODULES } from '../constants';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // append all api modules
    ...API_MODULES,
  ],
})
export class AppModule {}
