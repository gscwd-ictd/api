import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: '127.0.0.1',
          port: 6281,
          password: 'IloVdTTpdX',
        },
      },
    ]),
  ],
  providers: [ItemsService, MicroserviceClient],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
