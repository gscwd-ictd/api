export enum LspType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organizaation',
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

export enum TrainingStatus {
  ON_GOING_NOMINATION = 'on going nomination',
  PDC_APPROVAL = 'for pdc approval',
  GM_APPROVAL = 'for gm approval',
  DONE = 'done',
}

export enum TrainingNomineeStatus {
  CONTINUED = 'continued', //ask eric
  DECLINED = 'declined',
  PENDING = 'pending',
}

export type RawEmployeeFullName = {
  fullName: string;
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
