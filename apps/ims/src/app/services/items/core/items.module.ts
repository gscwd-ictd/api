import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    ClientsModule.registerAsync([
      {
        name: MS_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.REDIS,
            options: {
              host: configService.getOrThrow<string>('ITEMS_REDIS_HOST'),
              port: parseInt(configService.getOrThrow<string>('ITEMS_REDIS_PORT')),
              password: configService.getOrThrow<string>('ITEMS_REDIS_PASS'),
            },
          };
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
