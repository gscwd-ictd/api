/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { HybridApp } from '@gscwd-api/microservices';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';

const whitelist = [
  'http://192.168.137.249:4103',
  'http://192.168.137.249:3109',
  'http://192.168.137.249:6102',
  'http://192.168.99.122:3109',
  'http://localhost:3109',
  'http://localhost:3002',
  'http://192.168.99.120:3109',
  'http://192.168.99.123:3102',
  'http://192.168.137.249:3102',
  'http://172.20.10.59:3001',
  'http://172.20.10.59:3005',
  'http://172.20.10.59:3109',
  'http://172.20.110.45:3005',
  'http://172.20.10.57:3005',
  'http://172.20.10.60:3002',
  'http://172.20.110.45:3001',
  'http://172.20.110.45:3002',
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.EMPLOYEE_MONITORING_REDIS_HOST,
      port: parseInt(process.env.EMPLOYEE_MONITORING_REDIS_PORT),
    },
  });

  // HybridApp.startMicroservice(app, {
  //   transport: Transport.REDIS,
  //   options:{
  //     host: process.env.EMPLOYEE_MONITORING_REDIS_HOST,
  //     port: parseInt(process.env.EMPLOYEE_MONITORING_REDIS_PORT)
  //   }
  // })

  app.startAllMicroservices();

  app.enableCors({
    credentials: true,
    origin: whitelist,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
