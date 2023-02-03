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
