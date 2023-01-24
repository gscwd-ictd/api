import { ItemDetailsView } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { CategoriesModule, CharacteristicsModule, ClassificationsModule, SpecificationsModule } from '../components';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(ItemDetailsView),
    CharacteristicsModule,
    ClassificationsModule,
    CategoriesModule,
    SpecificationsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
