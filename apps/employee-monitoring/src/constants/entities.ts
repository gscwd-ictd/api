import {
  Holidays,
  PassSlip,
  PassSlipApproval,
  LeaveBenefits,
  LeaveApplicationDates,
  LeaveApplication,
  Schedule,
  EmployeeSchedule,
  DailyTimeRecord,
  TravelOrder,
  TravelOrderItinerary,
  EmployeeRestDays,
  CustomGroups,
  CustomGroupMembers,
  ScheduleSheetView,
  LeaveCreditEarnings,
  LeaveCardLedgerDebit,
  LeaveCardLedgerCredit,
  LeaveAddBack,
  LeaveCreditDeductions,
  OvertimeImmediateSupervisor,
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
  EmployeeSchedule,
  DailyTimeRecord,
  TravelOrder,
  TravelOrderItinerary,
  EmployeeRestDays,
  EmployeeRestDay,
  CustomGroups,
  CustomGroupMembers,
  ScheduleSheetView,
  LeaveCreditEarnings,
  LeaveCardLedgerDebit,
  LeaveCardLedgerCredit,
  LeaveAddBack,
  LeaveCreditDeductions,
  OvertimeImmediateSupervisor,
];
