import { Module } from '@nestjs/common';
import { ItemCharacteristicModule } from '../components/characteristic';
import { ItemCategoryModule } from '../components/category';
import { ItemClassificationModule } from '../components/classification';
import { ItemSpecificationModule } from '../components/specification';
import { UnitModule } from '../components/unit';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { GeneratorModule } from '@gscwd-api/generator';

@Module({
  imports: [
    GeneratorModule.register({ length: 5, lowercase: false, uppercase: false, numeric: false }),
    ItemCharacteristicModule,
    ItemClassificationModule,
    ItemCategoryModule,
    ItemSpecificationModule,
    UnitModule,
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
