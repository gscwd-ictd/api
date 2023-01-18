import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.enableCors();

  app.enableVersioning({ type: VersioningType.URI });

  // set global prefix for endpoints
  const globalPrefix = 'api/finance';

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

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

  // intialize application port to listen to
  const port = process.env.FINANCE_PORT;

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Finance is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
