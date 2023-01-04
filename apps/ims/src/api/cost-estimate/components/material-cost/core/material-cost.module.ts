import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { MaterialCost } from '../data/material-cost.entity';

@Module({
  imports: [CrudModule.register(MaterialCost)],
  providers: [],
  controllers: [],
})
export class MaterialCostModule {}
