import { Module } from '@nestjs/common';
import { BudgetDetailModule } from '../components/budget-details';
import { EquipmentCostModule } from '../components/equipment-cost';
import { LaborCostModule } from '../components/labor-cost';
import { LaborTypeModule } from '../components/labor-type';
import { MaterialCostModule } from '../components/material-cost';
import { ProjectDetailModule } from '../components/project-detail';
import { ValueAddedTaxModule } from '../components/value-added-tax';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [BudgetDetailModule, EquipmentCostModule, LaborCostModule, LaborTypeModule, ProjectDetailModule, ValueAddedTaxModule, MaterialCostModule],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule {}
