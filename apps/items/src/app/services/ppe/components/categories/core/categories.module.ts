import { Module } from '@nestjs/common';
import { PpeCategoriesService } from './categories.service';
import { PpeCategoriesController } from './categories.controller';
import { CrudModule } from '@gscwd-api/crud';
import { PpeCategory } from '@gscwd-api/app-entities';
import { GeneratorModule } from '@gscwd-api/generator';

@Module({
  imports: [
    // crud module
    CrudModule.register(PpeCategory),

    // generator module
    GeneratorModule.register({ length: 5, lowercase: false }),
  ],
  controllers: [PpeCategoriesController],
  providers: [PpeCategoriesService],
  exports: [PpeCategoriesService],
})
export class PpeCategoriesModule {}
