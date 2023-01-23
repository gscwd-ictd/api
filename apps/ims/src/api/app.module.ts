import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from '../config';
import { API_MODULES } from '../constants';
import { LoggerMiddleware } from './app.service';
//import { LoggerMiddleware } from './app.service';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ims/.env') }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6180,
          password: 'IloVdTTpdX',
        },
      },
    ]),

    // append all api modules
    ...API_MODULES,
  ],
  providers: [MicroserviceClient],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
