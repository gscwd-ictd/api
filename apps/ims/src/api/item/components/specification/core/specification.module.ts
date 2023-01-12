import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemSpecification } from '../data/specification.entity';
import { GeneratorModule } from '@gscwd-api/generator';
import { SpecificationMicroserviceController } from './specification-ms.controller';

@Module({
  imports: [
    // register crud module
    CrudModule.register(ItemSpecification),

    // register string generator module
    GeneratorModule.register({ length: 10 }),
  ],
  controllers: [SpecificationController, SpecificationMicroserviceController],
  providers: [SpecificationService],
  exports: [SpecificationService],
})
export class ItemSpecificationModule {}
