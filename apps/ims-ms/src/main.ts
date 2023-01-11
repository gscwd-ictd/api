import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.IMS_REDIS_HOST,
      port: parseInt(process.env.IMS_REDIS_PORT),
      password: process.env.IMS_REDIS_PASS,
    },
  });

  await app.listen();

  const port = process.env.IMS_MS_PORT;

  Logger.log(`🚀 IMS Microservice is listening on port ${port}`);
}

bootstrap();
