import { OvertimeApproval } from '@gscwd-api/models';
import { CustomGroupsModule } from '../app/api/custom-groups/core/custom-groups.module';
import { EmployeeScheduleModule } from '../app/api/daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { ScheduleModule } from '../app/api/daily-time-record/components/schedule/core/schedule.module';
import { DailyTimeRecordModule } from '../app/api/daily-time-record/core/daily-time-record.module';
import { HolidaysModule } from '../app/api/holidays/core/holidays.module';
import { LeaveModule } from '../app/api/leave/core/leave.module';
import { OvertimeApplicationModule } from '../app/api/overtime/components/overtime-application/core/overtime-application.module';
import { OvertimeEmployeeModule } from '../app/api/overtime/components/overtime-employee/core/overtime-employee.module';
import { OvertimeImmediateSupervisorModule } from '../app/api/overtime/components/overtime-immediate-supervisor/core/overtime-immediate-supervisor.module';
import { PassSlipApprovalModule } from '../app/api/pass-slip/components/approval/core/pass-slip-approval.module';
import { PassSlipModule } from '../app/api/pass-slip/core/pass-slip.module';
import { TravelOrderModule } from '../app/api/travel-order/core/travel-order.module';

export const appModules = [
  LeaveModule,
  PassSlipModule,
  PassSlipApprovalModule,
  HolidaysModule,
  ScheduleModule,
  EmployeeScheduleModule,
  DailyTimeRecordModule,
  TravelOrderModule,
  CustomGroupsModule,
  OvertimeImmediateSupervisorModule,
  OvertimeApplicationModule,
  OvertimeEmployeeModule,
  OvertimeApproval,
];
