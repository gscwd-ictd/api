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
  TravelOrder,
  TravelOrderItinerary,
  EmployeeRestDays,
} from '@gscwd-api/models';
import { EmployeeRestDay } from 'libs/models/src/lib/databases/employee-monitoring/data/employee-rest-day/employee-rest-day.entity';

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
  TravelOrder,
  TravelOrderItinerary,
  EmployeeRestDays,
  EmployeeRestDay,
];
