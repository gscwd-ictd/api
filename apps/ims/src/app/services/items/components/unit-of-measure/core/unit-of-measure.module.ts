import { Module } from '@nestjs/common';
import { UnitOfMeasureService } from './unit-of-measure.service';
import { UnitOfMeasureController } from './unit-of-measure.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';

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
})
export class UnitOfMeasureModule {}
