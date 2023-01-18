import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.IMS_REDIS_HOST,
          port: parseInt(process.env.IMS_REDIS_PORT),
          password: process.env.IMS_REDIS_PASS,
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
    ]),
  ],
  providers: [TestService, MicroserviceClient],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
