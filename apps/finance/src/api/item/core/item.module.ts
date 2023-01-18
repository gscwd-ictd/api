import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ImsMicroservice } from '../../../config/';
import { ItemService } from './item.service';

@Module({
  imports: [ClientsModule.registerAsync([{ name: MS_CLIENT, useClass: ImsMicroservice }])],
  providers: [ItemService, MicroserviceClient],
  controllers: [],
  exports: [ItemService],
})
export class ItemModule {}
