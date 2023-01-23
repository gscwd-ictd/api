import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6180,
      password: 'IloVdTTpdX',
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  await app.listen();

  Logger.log(`🚀 Application is running`);
}

bootstrap();
