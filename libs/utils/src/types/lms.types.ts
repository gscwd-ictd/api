export enum LspType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
}

export enum LspSource {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum TrainingType {
  FOUNDATIONAL = 'foundational',
  TECHNICAL = 'technical',
  PROFESSIONAL = 'professional',
  SUPERVISOR = 'supervisor',
  LEADERSHIP_MANAGERIAL = 'leadership/managerial',
}

export enum TrainingPreparationStatus {
  PENDING = 'pending',
  ON_GOING_NOMINATION = 'on going nomination',
  PDC_APPROVAL = 'for pdc approval',
  GM_APPROVAL = 'for gm approval',
  NOMINATION_DONE = 'nomination done',
  DONE = 'done',
}

export enum TrainingStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'on going',
  COMPLETED = 'completed',
}

export enum TrainingNomineeStatus {
  CONTINUED = 'continued', //ask eric
  DECLINED = 'declined',
  PENDING = 'pending',
}

export type EmployeeFullName = {
  fullName: string;
};

export type PortalEmployeeDetails = {
  employeeId: string;
  contactNumber: string;
  email: string;
  postalAddress: string;
  photoUrl: string;
  tin: string;
  fullName: string;
  awards: [name: string];
  certifications: [name: string];
  educations: [degree: string, institution: string];
};

export type RawTag = {
  tag: string;
};

export type RawTrainingDetails = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: string;
  location: string;
  courseTitle: string;
  trainingStart: Date;
  trainingEnd: Date;
  numberOfHours: number;
  deadlineForSubmission: Date;
  invitationUrl: string;
  numberOfParticipants: number;
  status: TrainingStatus;
  nomineeQualifications: RawTag[];
};
