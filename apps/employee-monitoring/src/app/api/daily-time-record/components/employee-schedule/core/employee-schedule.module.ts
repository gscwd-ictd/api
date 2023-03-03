import { Module } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EmployeeSchedule } from '@gscwd-api/models';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CrudModule.register(EmployeeSchedule),
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
  providers: [EmployeeScheduleService, MicroserviceClient],
  controllers: [EmployeeScheduleController],
  exports: [EmployeeScheduleService],
})
export class EmployeeScheduleModule {}
