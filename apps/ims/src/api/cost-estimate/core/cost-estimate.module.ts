import { Module } from '@nestjs/common';
import { EquipmentCostModule } from '../components/equipment-cost';
import { ProjectDetailModule } from '../components/project-details/core/project-detail.module';
import { CostEstimateController } from './cost-estimate.controller';
import { CostEstimateService } from './cost-estimate.service';
import { LaborTypeModule } from '../components/labor-type';
import { LaborCostModule } from '../components/labor-cost';
import { MaterialCostModule } from '../components/material-cost';
import { ContractorProfitModule } from '../components/contractor-profit';

@Module({
  imports: [ProjectDetailModule, EquipmentCostModule, LaborCostModule, LaborTypeModule, MaterialCostModule, ContractorProfitModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
})
export class CostEstimateModule {}
