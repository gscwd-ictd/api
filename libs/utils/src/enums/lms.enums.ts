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
  TDD_MANAGER_APPROVAL = 'for tdd manager approval',
  TDD_MANAGER_DECLINED = 'tdd manager declined',
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
  NOMINATION_SKIPPED = 'nomination skipped',
  NOMINATION_SUBMITTED = 'nomination submitted',
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

export enum DocumentRequirementsType {
  ATTENDANCE = 'Attendance',
  PRE_TEST = 'Pre-test',
  COURSE_MATERIALS = 'Course Materials',
  POST_TRAINING_REPORT = 'Post Training Report',
  COURSE_EVALUATION_REPORT = 'Course Evaluation Report',
  LEARNING_APPLICATION_PLAN = 'Learning Application Plan',
  POST_TEST = 'Post-test',
  CERTIFICATE_OF_TRAINING = 'Certificate of Training',
  CERTIFICATE_OF_APPEARANCE = 'Certificate of Appearance',
  PROGRAM = 'Program',
}

export enum BenchmarkStatus {
  PENDING = 'pending',
  DONE = 'done',
}

export enum OtherTrainingCategory {
  CONFERENCE = 'conference',
  CONVENTION = 'convention',
  MEETING = 'meeting',
  ORIENTATION = 'orientation/talakayan',
  SEMINAR = 'seminar',
  SYMPOSIUM = 'symposium',
  WORKSHOP = 'workshop',
}

export enum OtherTrainingStatus {
  PENDING = 'pending',
  REQUIREMENTS_SUBMISSION = 'requirements submission',
  COMPLETED = 'completed',
}

export enum TrainingHistoryType {
  DRAFT_CREATE = 'draft created',
  SUPERVISOR_NOMINATION = 'supervisor nomination',
  TDD_MANAGER_REVIEW = 'tdd manager review',
  PDC_SECRETARIAT_REVIEW = 'pdc secretariat review',
  PDC_CHAIRMAN_REVIEW = 'pdc chairman review',
  GENERAL_MANAGER_REVIEW = 'general manager review',
  PARTICIPANT_BATCHING = 'participant batching',
  TRAINING_ONGOING = 'training ongoing',
  REQUIREMENTS_SUBMISSION = 'requirements submission',
  TRAINING_COMPLETED = 'training completed',
}
