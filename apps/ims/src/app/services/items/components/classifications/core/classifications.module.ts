import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClassificationsController } from './classifications.controller';
import { ClassificationsService } from './classifications.service';

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
  controllers: [ClassificationsController],
  providers: [ClassificationsService, MicroserviceClient],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
