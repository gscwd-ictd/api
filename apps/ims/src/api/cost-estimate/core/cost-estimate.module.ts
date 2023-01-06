import { Module } from '@nestjs/common';
import { EquipmentCostModule } from '../components/equipment-cost';
import { ProjectDetailModule } from '../components/project-details/core/project-detail.module';
import { CostEstimateController } from './cost-estimate.controller';
import { CostEstimateService } from './cost-estimate.service';
import { LaborTypeModule } from '../components/labor-type';
import { LaborCostModule } from '../components/labor-cost';

@Module({
  imports: [ProjectDetailModule, EquipmentCostModule, LaborCostModule, LaborTypeModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
})
export class CostEstimateModule {}
