import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { join } from 'path';
import { DatabaseConfig } from '../config/database.config';
import { appModules } from '../constants/modules';
import { LoggerMiddleWare } from './logger.service';

const envFilePath = join(__dirname, '../../../apps/employee-monitoring/.env');
console.log(envFilePath);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/employee-monitoring/.env') }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
    ...appModules,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleWare).forRoutes('*');
  }
}
