import {
  LspIndividualDetails,
  LspIndividualAffiliation,
  LspIndividualAward,
  LspIndividualCertification,
  LspIndividualCoaching,
  LspIndividualEducation,
  LspIndividualProject,
  LspIndividualTraining,
  LspSource,
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

  LspIndividualDetails,
  LspIndividualAffiliation,
  LspIndividualAward,
  LspIndividualCertification,
  LspIndividualCoaching,
  LspIndividualEducation,
  LspIndividualProject,
  LspIndividualTraining,

  LspSource,

  Tag,

  Training,
  TrainingDistribution,
  TrainingNominee,
  TrainingTag,
  // views
];
