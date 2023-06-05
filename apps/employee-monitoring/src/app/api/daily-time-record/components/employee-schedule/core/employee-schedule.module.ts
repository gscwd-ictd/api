import { Module } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EmployeeSchedule } from '@gscwd-api/models';
import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeeRestDayModule } from '../components/employee-rest-day/core/employee-rest-day.module';
import { CustomGroupsModule } from '../../../../custom-groups/core/custom-groups.module';
import { CustomGroupMembersModule } from '../../../../custom-groups/components/custom-group-members/core/custom-group-members.module';

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
    EmployeeRestDayModule,
    CustomGroupMembersModule,
  ],
  providers: [EmployeeScheduleService, MicroserviceClient],
  controllers: [EmployeeScheduleController],
  exports: [EmployeeScheduleService],
})
export class EmployeeScheduleModule {}
