import { Module } from '@nestjs/common';
import { BudgetDetailsModule } from '../components/budget-details';
import { EquipmentCostModule } from '../components/equipment-cost';
import { LaborCostModule } from '../components/labor-cost';
import { LaborTypeModule } from '../components/labor-type';
import { MaterialCostModule } from '../components/material-cost';
import { ProjectDetailModule } from '../components/project-detail';
import { ValueAddedTaxModule } from '../components/value-added-tax';
import { CostEstimateController } from './cost-estimates.controller';
import { CostEstimateService } from './cost-estimates.service';

@Module({
  imports: [BudgetDetailsModule, EquipmentCostModule, LaborCostModule, LaborTypeModule, ProjectDetailModule, ValueAddedTaxModule, MaterialCostModule],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
})
export class CostEstimateModule {}
