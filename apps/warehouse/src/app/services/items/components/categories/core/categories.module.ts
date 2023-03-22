import { Module } from '@nestjs/common';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
