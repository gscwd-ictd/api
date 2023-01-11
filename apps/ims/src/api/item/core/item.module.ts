import { Module } from '@nestjs/common';
import { ItemSpecificationModule } from '../components/specification';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [ItemSpecificationModule],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
