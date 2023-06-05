/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.IVMS_DTR_HOST,
      port: parseInt(process.env.IVMS_DTR_PORT),
      password: process.env.IVMS_DTR_PASSWORD,
    },
  });

  await app.listen();
}

bootstrap();
