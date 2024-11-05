import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { join } from 'path';
import { DatabaseConfig } from '../config/database.config';
import { appModules } from '../constants/modules';
import { LoggerMiddleWare } from './logger.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserlogsMiddleware } from './api/user-logs/misc/middlewares/user-logs.middleware';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

const envFilePath = join(__dirname, '../../../apps/employee-monitoring/.env');
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/employee-monitoring/.env') }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
    ...appModules,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserlogsMiddleware).forRoutes('*');
  }
}
