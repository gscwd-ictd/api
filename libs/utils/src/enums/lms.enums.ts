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
  SUPERVISORY = 'supervisory',
  LEADERSHIP_MANAGERIAL = 'leadership/managerial',
}

export enum TrainingStatus {
  PENDING = 'pending',
  ON_GOING_NOMINATION = 'on going nomination',
  NOMINATION_DONE = 'nomination done',
  PDC_SECRETARIAT_APPROVAL = 'for pdc secretariat approval',
  PDC_SECRETARIAT_DECLINED = 'pdc secretariat declined',
  PDC_CHAIRMAN_APPROVAL = 'for pdc chairman approval',
  PDC_CHAIRMAN_DECLINED = 'pdc chairman declined',
  GM_APPROVAL = 'for gm approval',
  GM_DECLINED = 'gm declined',
  FOR_BATCHING = 'for batching',
  DONE_BATCHING = 'done batching',
  UPCOMING = 'upcoming',
  ON_GOING_TRAINING = 'on going training',
  REQUIREMENTS_SUBMISSION = 'requirements submission',
  COMPLETED = 'completed',
}

export enum TrainingDistributionStatus {
  NOMINATION_PENDING = 'nomination pending',
  NOMINATION_INELIGIBLE = 'nomination ineligible',
  NOMINATION_COMPLETED = 'nomination completed',
}

export enum TrainingNomineeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum NomineeType {
  NOMINEE = 'nominee',
  STAND_IN = 'stand-in',
}
