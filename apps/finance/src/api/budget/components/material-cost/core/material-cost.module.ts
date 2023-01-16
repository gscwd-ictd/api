import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '../data/material-cost.entity';

@Module({
  imports: [CrudModule.register(MaterialCost)],
  providers: [MaterialCostService],
  controllers: [MaterialCostController],
  exports: [MaterialCostService],
})
export class MaterialCostModule {}
