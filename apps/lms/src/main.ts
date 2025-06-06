import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { HybridApp } from '@gscwd-api/microservices';
import { Transport } from '@nestjs/microservices';
import * as session from 'express-session';
import * as redis from 'redis';
import RedisStore from 'connect-redis';
/**
 *  Copyright (C) General Santos City Water District - All Rights Reserved
 *
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *
 */

// const redisClient = createClient();
// redisClient.connect().catch(console.error);

// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: 'myapp:',
// });

const redisClientHrms = redis.createClient({
  url: `redis://${process.env.EMPLOYEE_MONITORING_REDIS_HOST}:6479`,
  password: 'IloVdTTpdX',
});
redisClientHrms.connect().catch(console.error);

async function bootstrap() {
  /**
   * initialize a nest application
   */
  const app = await NestFactory.create(AppModule);

  /**
   * set application port
   */
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<string>('LMS_PORT');

  /**
   * enable cors policy to allow browser access
   */
  const whitelist = [
    'http://172.20.110.45:3002',
    'http://localhost:3002',
    'http://172.20.10.57:3000',
    'http://172.20.10.57:3007',
    'http://172.20.110.45:3007',
    'http://172.20.10.57:3008',
    'http://172.20.110.60:3007',
    'http://172.20.110.45:3002',
    'http://172.20.110.60:3002',
    'http://172.20.10.63:3000',
    'https://portal.gscwd.app',
  ];

  app.use(
    '/',
    session({
      store: new RedisStore({ client: redisClientHrms }),
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

  app.enableCors({
    credentials: true,
    origin: whitelist,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  /**
   * enable api versioning
   */
  app.enableVersioning({ type: VersioningType.URI });

  /**
   *  apply the global prefix
   */
  app.setGlobalPrefix('api/lms');

  /**
   * enable validation
   */
  app.useGlobalPipes(
    /**
     * create a new validation pipe
     *
     * find more about ValidatorOptions at:
     *
     * https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
     */
    new ValidationPipe({
      /**
       * validator will strip validated object of any properties that do not use validation decorator
       */
      whitelist: true,

      /**
       * instead of stripping non-whitelisted properties, validator will throw an exception
       */
      forbidNonWhitelisted: true,

      /**
       * attempts to validate unknown objects fail immediately
       */
      forbidUnknownValues: true,

      /**
       * validator will skip validation of all properties that are null in the validating object
       */
      skipMissingProperties: false,
    })
  );

  /**
   *  enable hybrid application to listen to microservice requests
   */
  HybridApp.startMicroservice(app, {
    /**
     * set redis as the transport broker for this microservice
     */
    transport: Transport.REDIS,

    /**
     * provide connection settings
     */
    options: {
      /**
       * identify redis host
       */
      host: configService.getOrThrow<string>('LND_HOST'),

      /**
       * identify redis port
       */
      port: parseInt(configService.getOrThrow<string>('LND_PORT')),

      /**
       * identify redis password
       */
      password: configService.getOrThrow<string>('LND_PASS'),
    },
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/lms`, 'LMS');
}

bootstrap();
