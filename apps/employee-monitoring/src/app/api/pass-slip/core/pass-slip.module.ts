import { CrudModule } from '@gscwd-api/crud';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { PassSlip } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassSlipApprovalModule } from '../components/approval/core/pass-slip-approval.module';
import { PassSlipController } from './pass-slip.controller';
import { PassSlipService } from './pass-slip.service';

@Module({
  imports: [
    CrudModule.register(PassSlip),
    PassSlipApprovalModule,
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.EMPLOYEE_REDIS_HOST,
          port: parseInt(process.env.EMPLOYEE_REDIS_PORT),
        },
      },
    ]),
  ],
  providers: [PassSlipService, MicroserviceClient],
  controllers: [PassSlipController],
  exports: [PassSlipService],
})
export class PassSlipModule {}
