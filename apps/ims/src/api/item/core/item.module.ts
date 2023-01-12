import { Module } from '@nestjs/common';
import { ItemCategoryModule } from '../components/category';
import { ItemCharacteristicModule } from '../components/characteristic';
import { ItemClassificationModule } from '../components/classification';
import { ItemSpecificationModule } from '../components/specification';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [ItemCharacteristicModule, ItemClassificationModule, ItemCategoryModule, ItemSpecificationModule],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
