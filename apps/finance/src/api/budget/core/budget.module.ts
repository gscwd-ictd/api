import { Module } from '@nestjs/common';
import { EquipmentCostModule } from '../components/equipment-cost';
import { LaborCostModule } from '../components/labor-cost';
import { LaborTypeModule } from '../components/labor-type';
import { ProjectDetailModule } from '../components/project-detail';
import { ValueAddedTaxModule } from '../components/value-added-tax';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [EquipmentCostModule, LaborCostModule, LaborTypeModule, ProjectDetailModule, ValueAddedTaxModule],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule {}
