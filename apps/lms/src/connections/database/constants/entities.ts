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
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  TrainingSource,
  TrainingType,

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
