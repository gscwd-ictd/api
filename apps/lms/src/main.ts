import { SchedulerRegistry } from '@nestjs/schedule';
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
  // ENABLE_MICROSERVICES=false in this server's .env: this server does not answer microservice (Redis) requests,
  // so a second server on the same Redis (e.g. the backup .61) does not handle them twice
  if (process.env.ENABLE_MICROSERVICES !== 'false') {
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
  } else Logger.warn('ENABLE_MICROSERVICES=false: microservice (Redis) handlers are off on this server');

  await app.listen(port);

  // ENABLE_CRON=false in this server's .env stops every @Cron job (e.g. on the backup server, so only one server runs them)
  if (process.env.ENABLE_CRON === 'false') {
    const jobs = app.get(SchedulerRegistry).getCronJobs();
    jobs.forEach((job) => job.stop());
    Logger.warn(`ENABLE_CRON=false: ${jobs.size} scheduled job(s) stopped on this server`, 'Scheduler');
  }
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/lms`, 'LMS');
}

bootstrap();
