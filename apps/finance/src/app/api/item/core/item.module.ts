import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: parseInt(configService.getOrThrow<string>('REDIS_PORT')),
            password: configService.getOrThrow<string>('REDIS_PASS'),
          },
        }),
      },
    ]),
  ],
  controllers: [ItemController],
  providers: [ItemService, MicroserviceClient],
  exports: [ItemService],
})
export class ItemModule {}
