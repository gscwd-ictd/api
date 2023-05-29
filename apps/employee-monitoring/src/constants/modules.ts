import { EmployeeScheduleModule } from '../app/api/daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { EmployeeRestDaysModule } from '../app/api/daily-time-record/components/employee-schedule/components/employee-rest-days/core/employee-rest-days.module';
import { ScheduleRestDayModule } from '../app/api/daily-time-record/components/schedule/components/rest-day/core/schedule-rest-day.module';
import { ScheduleModule } from '../app/api/daily-time-record/components/schedule/core/schedule.module';
import { DailyTimeRecordModule } from '../app/api/daily-time-record/core/daily-time-record.module';
import { HolidaysModule } from '../app/api/holidays/core/holidays.module';
import { LeaveModule } from '../app/api/leave/core/leave.module';
import { PassSlipApprovalModule } from '../app/api/pass-slip/components/approval/core/pass-slip-approval.module';
import { PassSlipModule } from '../app/api/pass-slip/core/pass-slip.module';
import { TravelOrderModule } from '../app/api/travel-order/core/travel-order.module';

export const appModules = [
  LeaveModule,
  PassSlipModule,
  PassSlipApprovalModule,
  HolidaysModule,
  ScheduleModule,
  ScheduleRestDayModule,
  EmployeeScheduleModule,
  DailyTimeRecordModule,
  TravelOrderModule,
  EmployeeRestDaysModule,
];
