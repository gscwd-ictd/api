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
  TrainingDesign,
  TrainingDetails,
  TrainingDistribution,
  TrainingLspDetails,
  TrainingRecommendedEmployee,
  TrainingSource,
  TrainingTag,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities

  //new learning service provider
  LspDetails,
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspEducation,
  LspProject,
  LspTraining,

  //new tag
  Tag,

  //new training
  TrainingSource,
  TrainingDesign,
  TrainingDetails,
  TrainingLspDetails,
  TrainingTag,
  TrainingDistribution,
  TrainingRecommendedEmployee,

  // views
];
