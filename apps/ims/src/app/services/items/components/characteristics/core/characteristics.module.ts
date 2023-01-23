import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';

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
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService, MicroserviceClient],
  exports: [CharacteristicsService],
})
export class CharacteristicsModule {}
