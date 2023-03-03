import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationDatesModule } from '../../leave-application-dates/core/leave-application-dates.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CrudModule.register(LeaveApplication),
    LeaveApplicationDatesModule,
    ScheduleModule.forRoot(),
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
  providers: [LeaveApplicationService, MicroserviceClient],
  controllers: [LeaveApplicationController],
  exports: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
