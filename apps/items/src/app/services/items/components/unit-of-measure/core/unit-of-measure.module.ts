import { UnitOfMeasure } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { UnitOfMeasureController } from './unit-of-measure.controller';
import { UnitOfMeasureService } from './unit-of-measure.service';

@Module({
  imports: [CrudModule.register(UnitOfMeasure)],
  controllers: [UnitOfMeasureController],
  providers: [UnitOfMeasureService],
})
export class UnitOfMeasureModule {}
