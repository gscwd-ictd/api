import { LargeNumberLike } from 'crypto';

export enum LeaveTypes {
  RECURRING = 'recurring',
  CUMULATIVE = 'cumulative',
  SLB = 'special leave benefit',
}

export enum CreditDistribution {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum LeaveApplicationStatus {
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  FOR_HRMO_APPROVAL = 'for hrmo approval',
  FOR_SUPERVISOR_APPROVAL = 'for supervisor approval',
  FOR_HRDM_APPROVAL = 'for hrdm approval',
  DISAPPROVED_BY_SUPERVISOR = 'disapproved by supervisor',
  DISAPPROVED_BY_HRDM = 'disapproved by hrdm',
  DISAPPROVED_BY_HRMO = 'disapproved by hrmo',
  CANCELLED = 'cancelled',
}

export enum LeaveDayStatus {
  APPROVED = 'approved',
  FOR_CANCELLATION = 'for cancellation',
  CANCELLED = 'cancelled',
}

export type LeaveApplicationType = {
  id: string;
  leaveName: string;
  dateOfFiling: Date;
  status: LeaveApplicationStatus;
};

export type DtrPayload = {
  dateFrom: Date;
  dateTo: Date;
};

export enum NatureOfBusiness {
  PERSONAL = 'Personal Business',
  HALF_DAY = 'Half Day',
  UNDERTIME = 'Undertime',
  OFFICIAL_BUSINESS = 'Official Business',
}

export enum ObTransportation {
  OFFICIAL_VEHICLE = 'Office Vehicle',
  PRIVATE_PERSONAL = 'Private/Personal Vehicle',
  PUBLIC = 'Public Vehicle',
}

export enum PassSlipApprovalStatus {
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  DISAPPROVED_BY_HRMO = 'disapproved by hrmo',
  DISAPPROVED = 'disapproved',
  FOR_HRMO_APPROVAL = 'for hrmo approval',
  FOR_SUPERVISOR_APPROVAL = 'for supervisor approval',
  FOR_DISPUTE = 'for dispute',
  USED = 'used',
  CANCELLED = 'cancelled',
  UNUSED = 'unused',
}

export enum HolidayType {
  REGULAR = 'regular',
  SPECIAL_NON_WORKING = 'special',
}

export enum ScheduleType {
  REGULAR = 'regular',
  FLEXIBLE = 'flexible',
}

export enum ScheduleShift {
  DAY = 'day',
  NIGHT = 'night',
}

export enum RestDays {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum ScheduleBase {
  OFFICE = 'Office',
  FIELD = 'Field',
  PUMPING_STATION = 'Pumping Station',
}

export enum Report {
  REPORT_ON_ATTENDANCE = 'report on attendance',
  REPORT_ON_PERSONAL_BUSINESS = 'report on personal business pass slip',
  REPORT_ON_OFFICIAL_BUSINESS = 'report on official business pass slip',
  REPORT_ON_PERSONAL_BUSINESS_DETAILED = 'detailed report on personal business pass slip',
  REPORT_ON_OFFICIAL_BUSINESS_DETAILED = 'detailed report on official business pass slip',
  REPORT_ON_EMPLOYEE_FORCED_LEAVE_CREDITS = 'report on employee forced leave credits',
  REPORT_ON_EMPLOYEE_LEAVE_CREDIT_BALANCE = 'report on employee leave credit balance',
  REPORT_ON_EMPLOYEE_LEAVE_CREDIT_BALANCE_WITH_MONEY = 'report on employee leave credit balance with money',
  REPORT_ON_SUMMARY_OF_LEAVE_WITHOUT_PAY = 'report on summary of leave without pay',
}

export type VacationLeaveDetails = {
  inPhilippinesOrAbroad: string;
  location: string;
};

export type SickLeaveDetails = {
  hospital: string;
  illness: string;
};

export type StudyLeaveDetails = {
  forMastersCompletion: boolean;
  forBarBoardReview: boolean;
  studyLeaveOther: string;
};

export type DailyTimeRecordPayload = {
  companyId: string;
  dtrDates: Date[];
};

export type DailyTimeRecordPayloadForSingleEmployee = {
  companyId: string;
  date: Date;
};

export type EmployeeMonthlyDailyTimeRecord = {
  month: number;
  year: number;
  companyId: string;
};

export type EmployeeScheduleType = {
  id: string;
  esDateFrom: Date;
  esDateTo: Date;
  scheduleName: string;
  scheduleType: ScheduleType;
  timeIn: string;
  lunchOut: string;
  lunchIn: string;
  timeOut: string;
  scheduleBase: string;
  dateFrom: Date;
  dateTo: Date;
  scheduleRange: string;
  restDaysNumbers: string;
  restDaysNames: string;
  shift: string;
};

export type DailyTimeRecordType = {
  schedule: EmployeeScheduleType;
  dtr: {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    id: string;
    companyId: string;
    dtrDate: Date;
    timeIn: number;
    lunchOut: number;
    lunchIn: number;
    timeOut: number;
  };
};

export type MonthlyDtrItemType = Pick<DailyTimeRecordType, 'dtr' | 'schedule'> & {
  day: string;
  holidayType: HolidayType;
  summary: DtrSummary;
};

export type DtrSummary = {
  noOfLates: number;
  totalMinutesLate: number;
  noOfTimesUndertime: number;
  totalMinutesUndertime: number;
  noAttendance: number;
  isHalfDay: boolean;
};

export type PassSlipForLedger = {
  id: string;
  employeeId: string;
  dateOfApplication: Date;
  natureOfBusiness: NatureOfBusiness;
  isMedical: boolean;
  timeIn: number;
  timeOut: number;
  obTransportation: ObTransportation;
  estimateHours: number;
  encodedTimeIn: number;
  encodedTimeOut: number;
  purposeDestination: string;
  disputeRemarks: string;
  isDisputeApproved: boolean;
  status: PassSlipApprovalStatus;
  isCancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type LeaveLedger = {
  ID: number;
  period: Date;
  particulars: string;
  forcedLeave: number;
  forcedLeaveBalance: number;
  vacationLeave: number;
  vacationLeaveBalance: number;
  sickLeave: number;
  sickLeaveBalance: number;
  specialLeaveBenefit: number;
  specialLeaveBenefitBalance: number;
  specialPrivilegeLeave: number;
  specialPrivilegeLeaveBalance: number;
  leaveDates: string;
  actionType: string;
  remarks: string;
};

export enum OvertimeStatus {
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  FOR_APPROVAL = 'for approval',
}

export enum OvertimeSummaryHalf {
  FIRST_HALF = 'first',
  SECOND_HALF = 'second',
}

export enum DtrCorrectionStatus {
  FOR_APPROVAL = 'for approval',
  APPROVED = 'approved',
}

export type PassSlipForDispute = {
  passSlipId: string;
  supervisorId: string;
  status: string;
  employeeId: string;
  timeIn: number;
  timeOut: number;
};

export type OvertimeHrsRendered = {
  followEstimatedHrs: boolean;
  estimatedHours: number;
  computedEncodedHours: number;
  computedIvmsHours: number;
};

export type User = {
  employeeId: string;
  name: string;
};
