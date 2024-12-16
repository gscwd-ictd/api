import { forwardRef, Module } from '@nestjs/common';
import { LeaveCardLedgerCreditService } from './leave-card-ledger-credit.service';
import { LeaveCardLedgerCreditController } from './leave-card-ledger-credit.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveCardLedgerCredit } from '@gscwd-api/models';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeaveCreditEarningsModule } from '../../leave-credit-earnings/core/leave-credit-earnings.module';

@Module({
  imports: [
    CrudModule.register(LeaveCardLedgerCredit),
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
    EmployeesModule,
    LeaveCreditEarningsModule,
  ],
  providers: [LeaveCardLedgerCreditService, EmployeesService, MicroserviceClient],
  controllers: [LeaveCardLedgerCreditController],
  exports: [LeaveCardLedgerCreditService, MicroserviceClient],
})
export class LeaveCardLedgerCreditModule { }
