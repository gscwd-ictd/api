import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ItemsModule } from './services/items';
import { DatabaseModule } from '../connections';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../apps/ims/.env'),
    }),

    // database connection via typeorm
    DatabaseModule,

    // modules under microservices client
    ItemsModule,
  ],
})
export class AppModule {}
