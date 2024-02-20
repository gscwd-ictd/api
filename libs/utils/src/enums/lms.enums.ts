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
  PDC_SECRETARY_APPROVAL = 'for pdc secretary approval',
  PDC_SECRETARY_DECLINED = 'for pdc secretary declined',
  PDC_CHAIRMAN_APPROVAL = 'for pdc chairman approval',
  PDC_CHAIRMAN_DECLINED = 'for pdc chairman declined',
  GM_APPROVAL = 'for gm approval',
  GM_DECLINED = 'for gm declined',
  FOR_BATCHING = 'for batching',
  DONE_BATCHING = 'done batching',
  UPCOMING = 'upcoming',
  ON_GOING_TRAINING = 'on going training',
  REQUIREMENTS_SUBMISSION = 'requirements submission',
  COMPLETED = 'completed',
}

export enum TrainingDistributionStatus {
  FOR_NOMINATION = 'for nomination',
  NOMINATION_COMPLETE = 'nomination complete',
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

export enum PdcSecretaryStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export enum PdcChairmanStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export enum GeneralManagerStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
}
