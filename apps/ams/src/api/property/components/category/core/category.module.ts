import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CrudModule } from '@gscwd-api/crud';
import { PropertyCategory } from '../data/category.entity';
import { GeneratorModule } from '@gscwd-api/generator';

@Module({
  imports: [CrudModule.register(PropertyCategory), GeneratorModule.register({ length: 5, lowercase: false })],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
