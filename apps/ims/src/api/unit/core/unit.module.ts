import { Module } from '@nestjs/common';
import { UnitOfMeasureModule } from '../components/unit-of-measure';
import { UnitTypeModule } from '../components/unit-type';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [UnitTypeModule, UnitOfMeasureModule],
  providers: [UnitService],
  controllers: [UnitController],
})
export class UnitModule {}
