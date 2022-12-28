import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';
import { AuthenticationModule } from './authentication';
import { EmployeeModule } from './employee';
import { UserModule } from './user';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // api modules
    AuthenticationModule,
    UserModule,
    EmployeeModule,
  ],
})
export class AppModule {}
