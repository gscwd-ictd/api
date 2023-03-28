import { Module } from '@nestjs/common';
import { LaborCostService } from './labor-costs.service';
import { LaborCostController } from './labor-costs.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LaborCost } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LaborCost)],
  controllers: [LaborCostController],
  providers: [LaborCostService],
  exports: [LaborCostService],
})
export class LaborCostModule {}
