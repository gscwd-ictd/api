import { NomineeType, TrainingNomineeStatus } from '../enums';

export type EmployeeFullNameRaw = {
  fullName: string;
};

export type OrganizationRaw = {
  _id: string;
  name: string;
  orgStruct: string;
  code: string;
};

export type OrganizationEmployeeRaw = {
  value: string;
  label: string;
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
  trainingId: string;
  supervisorId: string;
  nomineeType: NomineeType;
};

export type NomineeRaw = {
  employeeId: string;
  status: TrainingNomineeStatus;
};

export type TrainingRequirementsRaw = {
  document: string;
  code?: string;
};

export type EmployeeParticpantsRaw = {
  _id: string;
  name: string;
  positionTitle: string;
  assignment: string;
};

export type SupervisorParticipantsRaw = {
  _id: string;
  name: string;
  positionTitle: string;
  assignment: string;
};

export type BenchmarkParticipantsRaw = {
  employee: EmployeeParticpantsRaw;
  supervisor: SupervisorParticipantsRaw;
};

export type SupervisorRaw = {
  employeeId: string;
  fullName: string;
};

export type EmployeeListsRaw = {
  value: string;
  label: string;
};

export type EmployeeDetailsRaw = {
  companyId: string;
  employeeFullName: string;
  employeeFullNameFirst: string;
  assignment: {
    id: string;
    name: string;
    positionId: string;
    positionTitle: string;
  };
};

export type EmployeeDetailsWithSignatureRaw = {
  companyId: string;
  employeeFullName: string;
  signatureUrl: string;
  assignment: {
    id: string;
    name: string;
    positionId: string;
    positionTitle: string;
  };
};

export type SignatoriesRaw = {
  signatories: {
    tddMgr: {
      name: string;
      signature: string;
      position: string;
    };
    hrdMgr: {
      name: string;
      signature: string;
      position: string;
    };
    gm: {
      name: string;
      signature: string;
      position: string;
    };
  };
};

export type TrainingHistroyRaw = {
  date: Date;
  title: string;
  description: string;
  status: string;
};
