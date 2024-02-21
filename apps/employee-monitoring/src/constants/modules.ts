import { CustomGroupsModule } from '../app/api/custom-groups/core/custom-groups.module';
import { EmployeeScheduleModule } from '../app/api/daily-time-record/components/employee-schedule/core/employee-schedule.module';
import { ScheduleModule } from '../app/api/daily-time-record/components/schedule/core/schedule.module';
import { DailyTimeRecordModule } from '../app/api/daily-time-record/core/daily-time-record.module';
import { EmsSettingsModule } from '../app/api/ems-settings/core/ems-settings.module';
import { HolidaysModule } from '../app/api/holidays/core/holidays.module';
import { LeaveModule } from '../app/api/leave/core/leave.module';
import { ModulesModule } from '../app/api/modules/core/modules.module';
import { OfficerOfTheDayModule } from '../app/api/officer-of-the-day/core/officer-of-the-day.module';
import { OvertimeModule } from '../app/api/overtime/core/overtime.module';
import { PassSlipApprovalModule } from '../app/api/pass-slip/components/approval/core/pass-slip-approval.module';
import { PassSlipModule } from '../app/api/pass-slip/core/pass-slip.module';
import { ReportsModule } from '../app/api/reports/core/reports.module';
import { StatsModule } from '../app/api/stats/core/stats.module';
import { TravelOrderModule } from '../app/api/travel-order/core/travel-order.module';
import { UserLogsModule } from '../app/api/user-logs/core/user-logs.module';
import { UserRolesModule } from '../app/api/user-roles/core/user-roles.module';

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
  ModulesModule,
  UserRolesModule,
  StatsModule,
  UserLogsModule,
  ReportsModule,
  EmsSettingsModule,
  OfficerOfTheDayModule,
];
