import { NomineeType, TrainingNomineeStatus } from '../enums';

export type EmployeeFullNameRaw = {
  fullName: string;
};

export type PortalEmployeeDetailsRaw = {
  employeeId: string;
  sex: string;
  contactNumber: string;
  email: string;
  postalAddress: string;
  photoUrl: string;
  tin: string;
  fullName: string;
  awards: [name: string];
  certifications: [name: string];
  education: [degree: string, institution: string];
};

export type TrainingNomineeRaw = {
  distributionId: string;
  nomineeType: NomineeType;
};

export type NomineeRaw = {
  employeeId: string;
  status: TrainingNomineeStatus;
};
