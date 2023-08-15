import { Module } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';
import { DailyTimeRecordController } from './daily-time-record.controller';
import { CrudModule } from '@gscwd-api/crud';
import { DailyTimeRecord, LeaveCardLedgerDebit } from '@gscwd-api/models';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeeScheduleModule } from '../components/employee-schedule/core/employee-schedule.module';
import { HolidaysModule } from '../../holidays/core/holidays.module';
import { ScheduleModule } from '../components/schedule/core/schedule.module';
import { LeaveCardLedgerDebitModule } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.module';
import { LeaveCardLedgerCreditModule } from '../../leave/components/leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { LeaveAddBackModule } from '../../leave/components/leave-add-back/core/leave-add-back.module';
import { EmployeesModule } from '../../employees/core/employees.module';

@Module({
  imports: [
    CrudModule.register(DailyTimeRecord),
    ClientsModule.register([
      {
        name: MS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.IVMS_REDIS_HOST,
          port: parseInt(process.env.IVMS_REDIS_PORT),
          password: process.env.IVMS_REDIS_PASSWORD,
        },
      },
    ]),
    EmployeeScheduleModule,
    HolidaysModule,
    ScheduleModule,
    LeaveCardLedgerDebitModule,
    LeaveCardLedgerCreditModule,
    LeaveAddBackModule,
    EmployeesModule,
  ],
  providers: [DailyTimeRecordService, MicroserviceClient],
  controllers: [DailyTimeRecordController],
  exports: [DailyTimeRecordService],
})
export class DailyTimeRecordModule {}
