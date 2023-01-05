import { Module } from '@nestjs/common';
import { EquipmentCostService } from './equipment-cost.service';
import { EquipmentCostController } from './equipment-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ProjectDetail } from '../../project-details';

@Module({
  imports: [CrudModule.register(ProjectDetail)],
  controllers: [EquipmentCostController],
  providers: [EquipmentCostService],
  exports: [EquipmentCostService],
})
export class EquipmentCostModule {}
