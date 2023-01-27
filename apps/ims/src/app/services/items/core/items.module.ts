import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CategoriesModule,
  CharacteristicsModule,
  ClassificationsModule,
  SpecificationsModule,
  DetailsModule,
  UnitOfMeasureModule,
} from '../components';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    // client module
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.ITEMS_REDIS_HOST,
          port: parseInt(process.env.ITEMS_REDIS_PORT),
          password: process.env.ITEMS_REDIS_PASS,
        },
      },
    ]),

    // child modules
    UnitOfMeasureModule,
    CharacteristicsModule,
    ClassificationsModule,
    CategoriesModule,
    SpecificationsModule,
    DetailsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, MicroserviceClient],
})
export class ItemsModule {}
