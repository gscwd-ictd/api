import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemSpecification } from '../data/specification.entity';

@Module({
  imports: [CrudModule.register(ItemSpecification)],
  providers: [SpecificationService],
  controllers: [SpecificationController],
})
export class SpecificationModule {}
