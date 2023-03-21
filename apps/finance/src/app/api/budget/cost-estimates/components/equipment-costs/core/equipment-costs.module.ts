import { Module } from '@nestjs/common';
import { EquipmentCostService } from './equipment-costs.service';
import { EquipmentCostController } from './equipment-costs.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EquipmentCost } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(EquipmentCost)],
  controllers: [EquipmentCostController],
  providers: [EquipmentCostService],
  exports: [EquipmentCostService],
})
export class EquipmentCostModule {}
