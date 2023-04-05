import { Module } from '@nestjs/common';
import { CostEstimateModule } from '../../../api/budget/cost-estimates';
import { CostEstimateMSController } from './cost-estimates-ms.controller';

@Module({
  imports: [CostEstimateModule],
  providers: [],
  controllers: [CostEstimateMSController],
  exports: [],
})
export class CostEstimatesMSModule {}
