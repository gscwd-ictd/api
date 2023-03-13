import {
  Holidays,
  PassSlip,
  PassSlipApproval,
  LeaveBenefits,
  LeaveApplicationDates,
  LeaveApplication,
  Schedule,
  ScheduleRestDay,
  EmployeeSchedule,
  DailyTimeRecord,
} from '@gscwd-api/models';

export const typeOrmEntities = [
  LeaveApplication,
  LeaveBenefits,
  LeaveApplicationDates,
  PassSlip,
  PassSlipApproval,
  Holidays,
  Schedule,
  ScheduleRestDay,
  EmployeeSchedule,
  DailyTimeRecord,
];
