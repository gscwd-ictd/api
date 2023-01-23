import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PpeCategoriesModule, PpeClassificationsModule, PpeSpecificationsModule } from '../components';
import { PpeController } from './ppe.controller';
import { PpeService } from './ppe.service';

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
    PpeClassificationsModule,
    PpeCategoriesModule,
    PpeSpecificationsModule,
  ],
  controllers: [PpeController],
  providers: [PpeService, MicroserviceClient],
})
export class PpeModule {}
