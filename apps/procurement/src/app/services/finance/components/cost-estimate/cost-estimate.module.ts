import { FinanceMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { CostEstimateService } from './cost-estimate.service';
import { CostEstimateController } from './cost-estimate.controller';

@Module({
  imports: [FinanceMicroserviceClientModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
  exports: [CostEstimateService],
})
export class CostEstimateModule {}
