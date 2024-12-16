import { Module } from '@nestjs/common';
import { TravelOrderService } from './travel-order.service';
import { TravelOrderController } from './travel-order.controller';
import { CrudModule } from '@gscwd-api/crud';
import { TravelOrder } from '@gscwd-api/models';
import { TravelOrderItineraryModule } from '../components/travel-order-itinerary/core/travel-order-itinerary.module';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CrudModule.register(TravelOrder),
    TravelOrderItineraryModule,
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.EMPLOYEE_REDIS_HOST,
          port: parseInt(process.env.EMPLOYEE_REDIS_PORT),
          password: process.env.EMPLOYEE_REDIS_PASSWORD,
        },
      },
    ]),
  ],
  providers: [TravelOrderService, MicroserviceClient],
  controllers: [TravelOrderController],
  exports: [TravelOrderService],
})
export class TravelOrderModule {}
