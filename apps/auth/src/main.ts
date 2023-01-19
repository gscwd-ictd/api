import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './api/app.module';
import { AuthMicroservice } from './config';
//import { MetadataInterceptor } from './global/interceptors/metadata.interceptor';

async function bootstrap() {
  // initialize a nest application
  const app = await NestFactory.create<NestApplication>(AppModule);

  // set global prefix for endpoints
  const globalPrefix = 'api/auth';

  // apply the global prefix
  app.setGlobalPrefix(globalPrefix);

  // apply global interceptor for transforming query results with createdAt and updatedAt as metadata
  // ! remove this!!!
  //app.useGlobalInterceptors(new MetadataInterceptor());

  // intialize application port to listen to
  const port = process.env.AUTH_PORT;

  // start all microservices
  await AuthMicroservice.start(app);

  // start the application
  await app.listen(port);

  // application logger
  Logger.log(`🚀 Authentication is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
