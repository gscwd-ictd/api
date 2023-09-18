import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { OvertimeAccomplishmentModule } from '../components/overtime-accomplishment/core/overtime-accomplishment.module';
import { OvertimeApplicationModule } from '../components/overtime-application/core/overtime-application.module';
import { OvertimeApprovalModule } from '../components/overtime-approval/core/overtime-approval.module';
import { OvertimeEmployeeModule } from '../components/overtime-employee/core/overtime-employee.module';
import { OvertimeImmediateSupervisorModule } from '../components/overtime-immediate-supervisor/core/overtime-immediate-supervisor.module';
import { EmployeesModule } from '../../employees/core/employees.module';
import { EmployeeScheduleModule } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { OvertimeMSController } from './overtime-ms.controller';

@Module({
  imports: [
    OvertimeAccomplishmentModule,
    OvertimeApplicationModule,
    OvertimeImmediateSupervisorModule,
    OvertimeApprovalModule,
    OvertimeEmployeeModule,
    EmployeesModule,
    EmployeeScheduleModule,
  ],
  providers: [OvertimeService],
  controllers: [OvertimeController, OvertimeMSController],
})
export class OvertimeModule {}
