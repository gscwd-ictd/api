import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ims-microservice/.env') }),

    // database configuration
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
  ],
})
export class AppModule {}
