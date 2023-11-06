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
}

export enum OvertimeSummaryHalf {
  FIRST_HALF = 'first',
  SECOND_HALF = 'second',
}

export type PassSlipForDispute = {
  passSlipId: string;
  supervisorId: string;
  status: string;
  employeeId: string;
  timeIn: number;
  timeOut: number;
};
