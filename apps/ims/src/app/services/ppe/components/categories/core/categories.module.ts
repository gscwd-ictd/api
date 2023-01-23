import { Module } from '@nestjs/common';
import { PpeCategoriesService } from './categories.service';
import { PpeCategoriesController } from './categories.controller';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  providers: [PpeCategoriesService, MicroserviceClient],
  controllers: [PpeCategoriesController],
  exports: [PpeCategoriesService],
})
export class PpeCategoriesModule {}
