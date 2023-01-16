import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '../data/material-cost.entity';

@Module({
  imports: [
    CrudModule.register(MaterialCost),
    ClientsModule.register([{ name: 'IMS_SERVICE', transport: Transport.REDIS, options: { host: '127.0.0.1', port: 6282, password: 'IloVdTTpdX' } }]),
  ],
  providers: [MaterialCostService],
  controllers: [MaterialCostController],
  exports: [MaterialCostService],
})
export class MaterialCostModule {}
