import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PpeSpecificationsController } from './specifications.controller';
import { PpeSpecificationsService } from './specifications.service';

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
  controllers: [PpeSpecificationsController],
  providers: [PpeSpecificationsService, MicroserviceClient],
  exports: [PpeSpecificationsService],
})
export class PpeSpecificationsModule {}
