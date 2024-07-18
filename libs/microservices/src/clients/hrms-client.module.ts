import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MicroserviceClient } from '../lib/ms-client.service';
import { MS_CLIENT } from '../utils/ms-provider';

@Module({
  providers: [
    {
      provide: MS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            host: configService.getOrThrow<string>('HRMS_HOST'),
            port: parseInt(configService.getOrThrow<string>('HRMS_PORT')),
            password: configService.getOrThrow<string>('HRMS_PASS'),
          },
        });
      },
    },
    MicroserviceClient,
  ],
  exports: [MicroserviceClient],
})
export class HrmsMicroserviceClientModule {}
