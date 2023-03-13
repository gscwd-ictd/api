import { EmployeeScheduleModule } from '../app/api/daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { ScheduleRestDayModule } from '../app/api/daily-time-record/components/schedule/components/rest-day/core/schedule-rest-day.module';
import { ScheduleModule } from '../app/api/daily-time-record/components/schedule/core/schedule.module';
import { DailyTimeRecordModule } from '../app/api/daily-time-record/core/daily-time-record.module';
import { HolidaysModule } from '../app/api/holidays/core/holidays.module';
import { LeaveApplicationDatesModule } from '../app/api/leave/components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../app/api/leave/components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../app/api/leave/components/leave-benefits/core/leave-benefits.module';
import { PassSlipApprovalModule } from '../app/api/pass-slip/components/approval/core/pass-slip-approval.module';
import { PassSlipModule } from '../app/api/pass-slip/core/pass-slip.module';

export const appModules = [
  LeaveApplicationModule,
  LeaveBenefitsModule,
  LeaveApplicationDatesModule,
  PassSlipModule,
  PassSlipApprovalModule,
  HolidaysModule,
  ScheduleModule,
  ScheduleRestDayModule,
  EmployeeScheduleModule,
  DailyTimeRecordModule,
];
