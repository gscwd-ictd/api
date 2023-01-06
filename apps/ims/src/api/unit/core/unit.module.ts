import { Module } from '@nestjs/common';
import { UnitOfMeasureModule } from '../components/unit-of-measure';
import { UnitTypeModule } from '../components/unit-type';

@Module({
  imports: [UnitTypeModule, UnitOfMeasureModule],
})
export class UnitModule {}
