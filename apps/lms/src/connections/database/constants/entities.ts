import {
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspDetails,
  LspEducation,
  LspProject,
  LspTraining,
  Tag,
  Training,
  TrainingDistribution,
  TrainingNominee,
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
  LspProject,
  LspTraining,
  LspDetails,

  Tag,

  Training,
  TrainingDistribution,
  TrainingNominee,
  // views
];
