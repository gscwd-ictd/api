import { CrudModule } from '@gscwd-api/crud';
import { RequestedItem } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ItemsModule } from '../../../../../../../services/items';
import { RequestedItemsController } from './requested-items.controller';
import { RequestedItemsService } from './requested-items.service';

@Module({
  imports: [CrudModule.register(RequestedItem), ItemsModule],
  controllers: [RequestedItemsController],
  providers: [RequestedItemsService],
  exports: [RequestedItemsService],
})
export class RequestedItemsModule {}
