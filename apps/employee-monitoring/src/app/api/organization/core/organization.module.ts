import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { MS_CLIENT } from '@gscwd-api/microservices';
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
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
