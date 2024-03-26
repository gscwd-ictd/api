/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as redis from 'redis';
import RedisStore from 'connect-redis';

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
  'http://172.20.10.63:3005',
  'http://172.20.10.58:3000',
];
//${process.env.EMPLOYEE_MONITORING_REDIS_HOST}
const redisClientHrms = redis.createClient({
  url: `redis://${process.env.EMPLOYEE_MONITORING_REDIS_HOST}:6479`,
});
redisClientHrms.connect().catch(console.error);

const redisClientPortal = redis.createClient({
  url: `redis://localhost:6379`,
});
redisClientPortal.connect().catch(console.error);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    '/',
    session({
      store: new RedisStore({
        client: redisClientHrms,
      }),
      name: 'ssid_hrms',
      secret: process.env.RSP_COOKIE_PASS,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        signed: true,
        secure: false,
        maxAge: 86000000,
        path: '/',
      },
    })
  );

  // app.use(
  //   '/',
  //   session({
  //     store: new RedisStore({
  //       client: redisClientPortal,
  //     }),
  //     name: 'ssid_portal',
  //     secret: process.env.PORTAL_COOKIE_PASS,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       httpOnly: true,
  //       signed: true,
  //       secure: false,
  //       maxAge: 86000000,
  //     },
  //   })
  // );

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
  //app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
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
