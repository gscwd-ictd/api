import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
