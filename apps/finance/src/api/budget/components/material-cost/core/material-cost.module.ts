import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';

@Module({
  providers: [MaterialCostService],
  controllers: [MaterialCostController],
  exports: [MaterialCostService],
})
export class MaterialCostModule {}
