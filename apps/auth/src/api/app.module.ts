import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { AuthenticationModule } from './authentication';
import { EmployeeModule } from './employee';
import { UserModule } from './user';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/auth/.env') }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // api modules
    AuthenticationModule,
    UserModule,
    EmployeeModule,
  ],
})
export class AppModule {}
