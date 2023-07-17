export enum LeaveTypes {
  RECURRING = 'Recurring',
  CUMULATIVE = 'Cumulative',
  SLB = 'Special Leave Benefit',
}

export enum CreditDistribution {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum LeaveApplicationStatus {
  APPROVED = 'approved',
  HR_APPROVED = 'hr approved',
  ONGOING = 'ongoing',
  DISAPPROVED = 'disapproved',
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
  DISAPPROVED = 'disapproved',
  FOR_APPROVAL = 'for approval',
  USED = 'used',
  CANCELLED = 'cancelled',
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
  noOfUndertimes: number;
  totalMinutesUndertime: number;
  isHalfDay: boolean;
};

// {
//   day: dayjs(currDate).format('YYYY-MM-DD'),
//   holidayType,
//   schedule: {
//     id: null,
//     lunchIn: null,
//     lunchOut: null,
//     restDaysNames: null,
//     restDaysNumbers: null,
//     schedule: null,
//     scheduleName: null,
//     scheduleType: null,
//     shift: null,
//     timeIn: null,
//     timeOut: null,
//   },
//   dtr: {
//     companyId: null,
//     createdAt: null,
//     deletedAt: null,
//     dtrDate: null,
//     id: null,
//     lunchIn: null,
//     lunchOut: null,
//     timeIn: null,
//     timeOut: null,
//     updatedAt: null,
//     remarks,
//   },
//   summary: {
//     noOfLates: null,
//     totalMinutesLate: null,
//     noOfUndertimes: null,
//     totalMinutesUndertime: null,
//     isHalfDay: null,
//   },
// };
