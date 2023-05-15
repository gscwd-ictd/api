import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

/**
 *  Copyright (C) General Santos City Water District - All Rights Reserved
 *
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *
 */

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
  app.enableCors();
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
      skipMissingProperties: true,
    })
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/lms`, 'LMS');
}

bootstrap();
