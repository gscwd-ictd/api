import {
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspDetails,
  LspEducation,
  LspExperience,
  LspProject,
  LspTraining,
  Training,
  TrainingSource,
  TrainingType,
  VenueDetails,
  VenueFacility,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  TrainingSource,
  TrainingType,
  VenueDetails,
  VenueFacility,

  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspEducation,
  LspExperience,
  LspProject,
  LspTraining,
  LspDetails,

  Training,
  // views
];
