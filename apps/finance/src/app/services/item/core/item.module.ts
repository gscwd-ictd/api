import { ItemsMicroserviceClientModule, MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
