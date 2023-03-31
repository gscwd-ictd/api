import { Module } from '@nestjs/common';
import { ItemModule } from '../../../../services/item';
import { BudgetDetailsModule } from '../components/budget-details';
import { EquipmentCostModule } from '../components/equipment-costs';
import { LaborCostModule } from '../components/labor-costs';
import { MaterialCostModule } from '../components/material-costs';
import { ProjectDetailsModule } from '../components/project-details';
import { ValueAddedTaxModule } from '../components/value-added-tax';
import { CostEstimateController } from './cost-estimates.controller';
import { CostEstimateService } from './cost-estimates.service';

@Module({
  imports: [
    ProjectDetailsModule,
    BudgetDetailsModule,
    ProjectDetailsModule,
    MaterialCostModule,
    LaborCostModule,
    EquipmentCostModule,
    ValueAddedTaxModule,
    ItemModule,
  ],
  providers: [CostEstimateService],
  controllers: [CostEstimateController],
  exports: [CostEstimateService],
})
export class CostEstimateModule {}
