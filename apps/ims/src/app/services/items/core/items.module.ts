import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoriesModule, CharacteristicsModule, ClassificationsModule, SpecificationsModule } from '../components';
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
    CharacteristicsModule,
    ClassificationsModule,
    CategoriesModule,
    SpecificationsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, MicroserviceClient],
})
export class ItemsModue {}
