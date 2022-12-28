import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { MeasurementUnit } from '../data/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [CrudModule.register(MeasurementUnit)],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
