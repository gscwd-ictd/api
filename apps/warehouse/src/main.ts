import { HybridApp } from '@gscwd-api/microservices';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  /**
   * initialize a nest application
   */
  const app = await NestFactory.create<NestApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  /**
   * set application port
   */
  const port = configService.getOrThrow<string>('WAREHOUSE_PORT');

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
  app.setGlobalPrefix('api/warehouse');

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
      host: configService.getOrThrow<string>('REDIS_HOST'),

      /**
       * identify redis port
       */
      port: parseInt(configService.getOrThrow<string>('REDIS_PORT')),

      /**
       * identify redis password
       */
      password: configService.getOrThrow<string>('REDIS_PASS'),
    },
  });

  /**
   * start the application
   */
  await app.listen(port);

  /**
   * application logger
   */
  Logger.log(`🚀 Warehouse application server is running on: http://localhost:${port}/api/warehouse`, 'WarehouseServer');
}

/**
 * run the application
 */
bootstrap();
