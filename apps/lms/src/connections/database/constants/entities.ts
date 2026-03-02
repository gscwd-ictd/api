import {
  Benchmark,
  BenchmarkParticipantRequirements,
  BenchmarkParticipants,
  EmployeeTrainingView,
  LspAffiliation,
  LspAward,
  LspCertification,
  LspCoaching,
  LspDetails,
  LspEducation,
  LspProject,
  LspRankView,
  LspRating,
  LspTraining,
  OtherTraining,
  OtherTrainingParticipant,
  OtherTrainingParticipantRequirements,
  Tag,
  TrainingApproval,
  TrainingDesign,
  TrainingDetails,
  TrainingDistribution,
  TrainingHistory,
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
  LspRating,

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
  TrainingHistory,

  /* benchmark */
  Benchmark,
  BenchmarkParticipants,
  BenchmarkParticipantRequirements,

  /* other trainings */
  OtherTraining,
  OtherTrainingParticipant,
  OtherTrainingParticipantRequirements,

  LspRankView,
  EmployeeTrainingView,
];
