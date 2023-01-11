import { Module } from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { LaborCostController } from './labor-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LaborCost } from '../data/labor-cost.entity';

@Module({
  imports: [CrudModule.register(LaborCost)],
  controllers: [LaborCostController],
  providers: [LaborCostService],
  exports: [LaborCostService],
})
export class LaborCostModule {}
