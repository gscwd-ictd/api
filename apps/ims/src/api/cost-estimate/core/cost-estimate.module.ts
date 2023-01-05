import { Module } from '@nestjs/common';
import { MaterialCostModule } from '../components/material-cost/core/material-cost.module';
import { CostEstimateController } from './cost-estimate.controller';
import { CostEstimateService } from './cost-estimate.service';

@Module({
  imports: [MaterialCostModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
})
export class CostEstimateModule {}
