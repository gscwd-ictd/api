import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '../data/material-cost.entity';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { ItemModule } from '../../../../item/core/item.module';

@Module({
  imports: [CrudModule.register(MaterialCost), ItemModule],
  providers: [MaterialCostService, MicroserviceClient],
  controllers: [MaterialCostController],
})
export class MaterialCostModule {}
