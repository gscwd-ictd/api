import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { MaterialCost } from '../data/material-cost.entity';
import { MaterialCostController } from './material-cost.controller';
import { MaterialCostService } from './material-cost.service';

@Module({
  imports: [CrudModule.register(MaterialCost)],
  providers: [MaterialCostService],
  controllers: [MaterialCostController],
  exports: [MaterialCostService],
})
export class MaterialCostModule {}
