import {
  Benchmark,
  BenchmarkParticipants,
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspDetails,
  LspEducation,
  LspProject,
  LspTraining,
  Tag,
  TrainingApproval,
  TrainingDesign,
  TrainingDetails,
  TrainingDistribution,
  TrainingLspDetails,
  TrainingNominee,
  TrainingRecommendedEmployee,
  TrainingRequirements,
  TrainingSource,
  TrainingTag,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities

  /* learning service provider */
  LspDetails,
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspEducation,
  LspProject,
  LspTraining,

  /* tag */
  Tag,

  /* training */
  TrainingSource,
  TrainingDesign,
  TrainingDetails,
  TrainingLspDetails,
  TrainingTag,
  TrainingDistribution,
  TrainingRecommendedEmployee,
  TrainingNominee,
  TrainingApproval,
  TrainingRequirements,

  /* benchmark */
  Benchmark,
  BenchmarkParticipants,
];
