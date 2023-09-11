import { CustomGroupsModule } from '../app/api/custom-groups/core/custom-groups.module';
import { EmployeeScheduleModule } from '../app/api/daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { ScheduleModule } from '../app/api/daily-time-record/components/schedule/core/schedule.module';
import { DailyTimeRecordModule } from '../app/api/daily-time-record/core/daily-time-record.module';
import { HolidaysModule } from '../app/api/holidays/core/holidays.module';
import { LeaveModule } from '../app/api/leave/core/leave.module';
import { OvertimeModule } from '../app/api/overtime/core/overtime.module';
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
  OvertimeModule,
];
