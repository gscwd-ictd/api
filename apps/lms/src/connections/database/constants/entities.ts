import {
  LspIndividualAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspDetails,
  LspEducation,
  LspProject,
  LspSource,
  LspTraining,
  Tag,
  Training,
  TrainingDistribution,
  TrainingNominee,
  TrainingSource,
  TrainingTag,
  TrainingType,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  TrainingSource,
  TrainingType,

  LspIndividualAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspEducation,
  LspProject,
  LspTraining,
  LspDetails,
  LspSource,

  Tag,

  Training,
  TrainingDistribution,
  TrainingNominee,
  TrainingTag,
  // views
];
