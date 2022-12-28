import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export class AuthMicroservice {
  public static async start(app: INestApplication) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        host: process.env.AUTH_MS_HOST,
        port: parseInt(process.env.AUTH_MS_PORT),
        password: process.env.AUTH_MS_PASS,
      },
    });
    await app.startAllMicroservices();
  }
}
