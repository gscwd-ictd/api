import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UnitTypesController } from './unit-types.controller';
import { UnitTypesService } from './unit-types.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.ITEMS_REDIS_HOST,
          port: parseInt(process.env.ITEMS_REDIS_PORT),
          password: process.env.ITEMS_REDIS_PASS,
        },
      },
    ]),
  ],
  controllers: [UnitTypesController],
  providers: [UnitTypesService, MicroserviceClient],
  exports: [UnitTypesService],
})
export class UnitTypesModule {}
