import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemCategory } from '../data/category.entity';

@Module({
  imports: [CrudModule.register(ItemCategory)],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
