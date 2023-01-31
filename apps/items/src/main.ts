import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.ITEMS_REDIS_HOST,
      port: parseInt(process.env.ITEMS_REDIS_PORT),
      password: process.env.ITEMS_REDIS_PASS,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  await app.listen();

  Logger.log(`🚀 Items microservice is listening on port ${process.env.ITEMS_REDIS_PORT}`);
}

bootstrap();
