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
  STAND_IN = 'stand-in',
  DECLINED = 'declined',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

export enum NomineeType {
  NOMINEE = 'nominee',
  STAND_IN = 'stand-in',
}