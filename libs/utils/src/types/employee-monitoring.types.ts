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
  DISAPPROVED = 'disapproved',
  CANCELLED = 'cancelled',
}

export type LeaveApplicationType = {
  id: string;
  leaveName: string;
  dateOfFiling: Date;
  leaveDates: string;
  status: LeaveApplicationStatus;
};

export enum NatureOfBusiness {
  PERSONAL = 'personal',
  HALF_DAY = 'half day',
  UNDERTIME = 'undertime',
  OFFICIAL_BUSINESS = 'official business',
}

export enum ObTransportation {
  OFFICIAL_VEHICLE = 'official vehicle',
  PRIVATE_PERSONAL = 'private/personal',
  PUBLIC = 'public',
}

export enum PassSlipApprovalStatus {
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  DISAPPROVED = 'disapproved',
}

export enum HolidayType {
  REGULAR = 'regular',
  SPECIAL_NON_WORKING = 'special non-working',
}

export enum ScheduleType {
  REGULAR = 'regular',
  PUMPING_STATION = 'pumping station',
  FLEXIBLE = 'flexible',
}

export enum ScheduleShift {
  MORNING = 'morning',
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
