import { ItemCategory } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { GeneratorModule } from '@gscwd-api/generator';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(ItemCategory),

    GeneratorModule.register({ length: 5, lowercase: false }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
