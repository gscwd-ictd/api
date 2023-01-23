import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UnitOfMeasureController } from './unit-measure.controller';
import { UnitOfMeasureService } from './unit-measure.service';

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
  providers: [UnitOfMeasureService, MicroserviceClient],
  controllers: [UnitOfMeasureController],
  exports: [UnitOfMeasureService],
})
export class UnitOfMeasureModule {}
