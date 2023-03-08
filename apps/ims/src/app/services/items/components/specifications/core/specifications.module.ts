import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ConfigService } from '@nestjs/config';

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
  providers: [SpecificationsService, MicroserviceClient],
  controllers: [SpecificationsController],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
