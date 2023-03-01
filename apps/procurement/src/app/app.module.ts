import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UtilityDbStoredFunctions } from '../common';
import { DatabaseConfig } from '../config';
import { API_MODULES } from '../constants';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/procurement/.env') }),

    // typeorm config to connect to postgres db
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    ...API_MODULES,
  ],
  providers: [UtilityDbStoredFunctions],
})
export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    Logger.log('All postgres functions have been initialized', 'Postgres Function');
  }
}
