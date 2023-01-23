import { INestApplication, NestHybridApplicationOptions } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

export class HybridApp {
  public static async startMicroservice(
    /**
     * the current Nest application that will be transformed into a hybrid app
     */
    app: INestApplication,

    /**
     * options to serve microservice requests
     */
    microserviceOptions: MicroserviceOptions,

    /**
     * additional configuration options to inherit application settings
     */
    hybridOptions?: NestHybridApplicationOptions
  ) {
    /**
     * transform Nest application to a hybrid instance
     */
    app.connectMicroservice<MicroserviceOptions>(microserviceOptions, hybridOptions);

    /**
     * start microservice connection
     */
    await app.startAllMicroservices();
  }
}
