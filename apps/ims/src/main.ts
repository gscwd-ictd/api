import { Logger, VersioningType } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './api/app.module';
//import { MetadataInterceptor } from './global/interceptors';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  // intialize application port to listen to
  const port = process.env.IMS_PORT;

  const globalPrefix = 'api/ims';

  // enable cors policy
  app.enableCors();

  // enable api versioning
  app.enableVersioning({ type: VersioningType.URI });

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.IMS_REDIS_HOST,
      port: parseInt(process.env.IMS_REDIS_PORT),
      password: process.env.IMS_REDIS_PASS,
    },
  });

  await app.startAllMicroservices();

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Inventory is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
