/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HybridApp } from '@gscwd-api/microservices';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  /**
   * initialize a nest application
   */

  /**
   * set application port
   */

  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<string>('SMS_PORT');

  app.enableCors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  /**
   * enable api versioning
   */
  app.enableVersioning({ type: VersioningType.URI });

  /**
   *  apply the global prefix
   */
  app.setGlobalPrefix('api/smsv2');

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
      host: configService.getOrThrow<string>('SMSV2_HOST'),

      /**
       * identify redis port
       */
      port: parseInt(configService.getOrThrow<string>('SMSV2_PORT')),

      /**
       * identify redis password
       */
      password: configService.getOrThrow<string>('SMSV2_PASS'),
    },
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/smsv2`, 'SMS');
}

bootstrap();
