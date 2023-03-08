import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ItemsModule } from '../app/services/items/core/items.module';
import { DatabaseModule } from '../connections';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../apps/items/.env'),
    }),

    // database connection using typeorm
    DatabaseModule,

    // microservice modules
    ItemsModule,
  ],
})
export class AppModule {}
