import { NomineeType } from '../enums';

export type LspDetailsRaw = {
  id: string;
  name: string;
  sex: string;
  contactNumber: string;
  email: string;
  tin: string;
  postalAddress: string;
  type: string;
  source: string;
};

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
