import { Module } from '@nestjs/common';
import { ItemsMicroserviceClientModule } from '../../../../../../connections';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
