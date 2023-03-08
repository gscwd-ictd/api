import { Module } from '@nestjs/common';
import { OrgStructureService } from './org-structure.service';
import { OrgStructureController } from './org-structure.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: '192.168.137.249',
          port: 6100,
        },
      },
    ]),
  ],
  providers: [OrgStructureService, MicroserviceClient],
  controllers: [OrgStructureController],
  exports: [OrgStructureService],
})
export class OrgStructureModule {}
