import { CrudModule } from '@gscwd-api/crud';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { PassSlip } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeesModule } from '../../employees/core/employees.module';
import { LeaveCardLedgerDebitModule } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.module';
import { PassSlipApprovalModule } from '../components/approval/core/pass-slip-approval.module';
import { PassSlipController } from './pass-slip.controller';
import { PassSlipService } from './pass-slip.service';
import { PassSlipControllerMs } from './pass-slip-ms.controller';
import { OfficerOfTheDayModule } from '../../officer-of-the-day/core/officer-of-the-day.module';

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
    LeaveCardLedgerDebitModule,
    EmployeesModule,
    OfficerOfTheDayModule,
  ],
  providers: [PassSlipService, MicroserviceClient],
  controllers: [PassSlipController, PassSlipControllerMs],
  exports: [PassSlipService],
})
export class PassSlipModule {}
