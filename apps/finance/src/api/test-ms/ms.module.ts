import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TestController } from './ms.controller';
import { TestService } from './ms.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_MS',
        transport: Transport.REDIS,
        options: {
          host: '127.0.0.1',
          port: 6282,
          password: 'IloVdTTpdX',
          retryAttempts: 10,
          retryDelay: 3000,
        },
      },
    ]),
  ],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
