import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.EMPLOYEE_REDIS_HOST,
          port: parseInt(process.env.EMPLOYEE_REDIS_PORT),
          password: process.env.EMPLOYEE_REDIS_PASSWORD,
        },
      },
    ]),
  ],
  providers: [ModulesService, MicroserviceClient],
  controllers: [ModulesController],
})
export class ModulesModule {}
