import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationDatesModule } from '../../leave-application-dates/core/leave-application-dates.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { OfficerOfTheDayModule } from '../../../../officer-of-the-day/core/officer-of-the-day.module';

@Module({
  imports: [
    CrudModule.register(LeaveApplication),
    LeaveApplicationDatesModule,
    EmployeesModule,
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
    OfficerOfTheDayModule,
  ],
  providers: [LeaveApplicationService, MicroserviceClient],
  controllers: [LeaveApplicationController],
  exports: [LeaveApplicationService, MicroserviceClient],
})
export class LeaveApplicationModule {}
