import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { appModules } from '../constants/module';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/procurement/.env') }),

    // typeorm config to connect to postgres db
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
    ...appModules,
  ],
})
export class AppModule {}
