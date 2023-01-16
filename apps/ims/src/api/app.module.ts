import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
//import { API_MODULES } from '../constants';
import { TestModule } from './z_test/test.module';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ims/.env') }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // append all api modules
    //...API_MODULES,

    TestModule,
  ],
})
export class AppModule {}
