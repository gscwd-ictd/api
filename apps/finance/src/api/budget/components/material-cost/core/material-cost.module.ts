import { Module } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';
import { MaterialCostController } from './material-cost.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MaterialCost } from '../data/material-cost.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CrudModule.register(MaterialCost),
    ClientsModule.register([
      {
        name: 'IMS_MICROSERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6282,
          password: 'IloVdTTpdX',
        },
      },
    ]),
  ],
  providers: [MaterialCostService],
  controllers: [MaterialCostController],
  exports: [MaterialCostService],
})
export class MaterialCostModule {}
