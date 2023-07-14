import { Module } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';
import { DailyTimeRecordController } from './daily-time-record.controller';
import { CrudModule } from '@gscwd-api/crud';
import { DailyTimeRecord } from '@gscwd-api/models';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeeScheduleModule } from '../components/employee-schedule/core/employee-schedule.module';
import { HolidaysModule } from '../../holidays/core/holidays.module';
import { ScheduleModule } from '../components/schedule/core/schedule.module';

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
  ],
  providers: [DailyTimeRecordService, MicroserviceClient],
  controllers: [DailyTimeRecordController],
  exports: [DailyTimeRecordService],
})
export class DailyTimeRecordModule {}
