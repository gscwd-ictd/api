import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.REDIS,
            options: {
              host: configService.getOrThrow<string>('ITEMS_REDIS_HOST'),
              port: parseInt(configService.getOrThrow<string>('ITEMS_REDIS_PORT')),
              password: configService.getOrThrow<string>('ITEMS_REDIS_PASS'),
            },
          };
        },
      },
    ]),
  ],
  controllers: [DetailsController],
  providers: [DetailsService, MicroserviceClient],
})
export class DetailsModule {}
