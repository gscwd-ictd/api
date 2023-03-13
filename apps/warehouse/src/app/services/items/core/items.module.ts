import { Module } from '@nestjs/common';
import { ItemsMicroserviceClientModule } from '../../../../connections';
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
    // items microservice client module
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
