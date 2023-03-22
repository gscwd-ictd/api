import { Module } from '@nestjs/common';
import { CrudModule } from '@gscwd-api/crud';
import { RequestedItem } from '@gscwd-api/models';
import { RequestedItemService } from './requested-item.service';
import { RequestedItemController } from './requested-item.controller';

@Module({
  imports: [CrudModule.register(RequestedItem)],
  providers: [RequestedItemService],
  controllers: [RequestedItemController],
  exports: [RequestedItemService],
})
export class RequestedItemModule {}
