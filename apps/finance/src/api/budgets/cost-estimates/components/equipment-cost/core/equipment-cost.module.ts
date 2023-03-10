import { Module } from '@nestjs/common';
import { EquipmentCostService } from './equipment-cost.service';
import { EquipmentCostController } from './equipment-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EquipmentCost } from '../data/equipment-cost.entity';

@Module({
  imports: [CrudModule.register(EquipmentCost)],
  controllers: [EquipmentCostController],
  providers: [EquipmentCostService],
  exports: [EquipmentCostService],
})
export class EquipmentCostModule {}
