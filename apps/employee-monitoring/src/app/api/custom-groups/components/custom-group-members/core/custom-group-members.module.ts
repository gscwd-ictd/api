import { Module } from '@nestjs/common';
import { CustomGroupMembersService } from './custom-group-members.service';
import { CrudModule } from '@gscwd-api/crud';
import { CustomGroupMembers } from '@gscwd-api/models';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    CrudModule.register(CustomGroupMembers),

    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.EMPLOYEE_REDIS_HOST,
          port: parseInt(process.env.EMPLOYEE_REDIS_PORT),
          password: process.env.EMPLOYE_REDIS_PASSWORD,
        },
      },
    ]),
  ],
  providers: [CustomGroupMembersService, MicroserviceClient],
  exports: [CustomGroupMembersService],
})
export class CustomGroupMembersModule {}
