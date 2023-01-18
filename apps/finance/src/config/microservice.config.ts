import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';

export class ImsMicroservice implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.IMS_REDIS_HOST,
        port: parseInt(process.env.IMS_REDIS_PORT),
        password: process.env.IMS_REDIS_PASS,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    };
  }
}
