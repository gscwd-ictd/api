import { Module } from '@nestjs/common';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';
import {
  CategoriesModule,
  CharacteristicsModule,
  ClassificationsModule,
  SpecificationsModule,
  DetailsModule,
  UnitOfMeasureModule,
} from '../components';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    ItemsMicroserviceClientModule,

    // child modules
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
