import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationDatesModule } from '../../leave-application-dates/core/leave-application-dates.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CrudModule.register(LeaveApplication),
    LeaveApplicationDatesModule,
    ClientsModule.register([
      {
        name: 'EMPLOYEE_MS',
        transport: Transport.REDIS,
        options: {
          host: process.env.EMPLOYEE_REDIS_HOST,
          port: parseInt(process.env.EMPLOYEE_REDIS_PORT),
        },
      },
    ]),
  ],
  providers: [LeaveApplicationService],
  controllers: [LeaveApplicationController],
  exports: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
