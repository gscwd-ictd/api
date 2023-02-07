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
