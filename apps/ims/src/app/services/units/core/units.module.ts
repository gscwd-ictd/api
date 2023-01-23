import { Module } from '@nestjs/common';
import { UnitOfMeasureModule, UnitTypesModule } from '../components';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  imports: [UnitTypesModule, UnitOfMeasureModule],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
