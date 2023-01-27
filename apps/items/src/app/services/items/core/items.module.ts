import { ItemsView } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import {
  CategoriesModule,
  CharacteristicsModule,
  ClassificationsModule,
  DetailsModule,
  SpecificationsModule,
  UnitOfMeasureModule,
} from '../components';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(ItemsView),
    UnitOfMeasureModule,
    CharacteristicsModule,
    ClassificationsModule,
    CategoriesModule,
    SpecificationsModule,
    DetailsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
