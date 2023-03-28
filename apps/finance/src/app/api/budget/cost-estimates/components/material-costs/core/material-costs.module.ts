import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-costs.service';
import { MaterialCostController } from './material-costs.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(MaterialCost)],
  controllers: [MaterialCostController],
  providers: [MaterialCostService],
})
export class MaterialCostModule {}
