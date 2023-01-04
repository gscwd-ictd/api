import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemCategory } from '../data/category.entity';
import { GeneratorModule } from '@gscwd-api/generator';

@Module({
  imports: [
    // register crud module
    CrudModule.register(ItemCategory),

    // register string generator module
    GeneratorModule.register({ length: 5, lowercase: false }),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class ItemCategoryModule {}
