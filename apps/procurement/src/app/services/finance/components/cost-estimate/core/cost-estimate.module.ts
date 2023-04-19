import { FinanceMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { CostEstimateController } from './cost-estimate.controller';
import { CostEstimateService } from './cost-estimate.service';

@Module({
  imports: [FinanceMicroserviceClientModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
  exports: [CostEstimateService],
})
export class CostEstimateModule {}
