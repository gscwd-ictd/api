import {
  Holidays,
  PassSlip,
  PassSlipApproval,
  LeaveBenefits,
  LeaveApplicationDates,
  LeaveApplication,
  Schedule,
  ScheduleRestDay,
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
];
