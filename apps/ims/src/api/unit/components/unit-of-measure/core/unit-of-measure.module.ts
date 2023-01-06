import { Module } from '@nestjs/common';
import { UnitOfMeasureService } from './unit-of-measure.service';
import { UnitOfMeasureController } from './unit-of-measure.controller';
import { UnitOfMeasure } from '../data/unit-of-measure.entity';
import { CrudModule } from '@gscwd-api/crud';

@Module({
  imports: [CrudModule.register(UnitOfMeasure)],
  providers: [UnitOfMeasureService],
  controllers: [UnitOfMeasureController],
})
export class UnitOfMeasureModule {}
