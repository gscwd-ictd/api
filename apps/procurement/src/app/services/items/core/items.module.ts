import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [ItemsMicroserviceClientModule],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
