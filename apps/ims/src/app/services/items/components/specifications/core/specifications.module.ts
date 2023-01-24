import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
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
  providers: [SpecificationsService, MicroserviceClient],
  controllers: [SpecificationsController],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
