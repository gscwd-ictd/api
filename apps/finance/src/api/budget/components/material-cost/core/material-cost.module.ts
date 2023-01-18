import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '../data/material-cost.entity';
// import { ItemModule } from '../../../../item/core/item.module';
import { ClientsModule } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ImsMicroservice } from '../../../../../config';

@Module({
  imports: [CrudModule.register(MaterialCost), ClientsModule.registerAsync([{ name: MS_CLIENT, useClass: ImsMicroservice }])],
  providers: [MaterialCostService, MicroserviceClient],
  controllers: [MaterialCostController],
})
export class MaterialCostModule {}
