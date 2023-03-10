import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ItemsModule } from './services/items';
import { DatabaseModule } from '../connections';

console.log(join(__dirname, '../../../apps/warehouse/.env'));

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../apps/warehouse/.env'),
    }),

    // database connection via typeorm
    DatabaseModule,

    // modules under microservices client
    ItemsModule,
  ],
})
export class AppModule {}
