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
  LspOrganizationDetails,
  LspOrganizationAffiliation,
  LspOrganizationAward,
  LspOrganizationCertification,
  LspOrganizationCoaching,
  LspOrganizationEducation,
  LspOrganizationProject,
  LspOrganizationTraining,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  LspSource,

  LspIndividualDetails,
  LspIndividualAffiliation,
  LspIndividualAward,
  LspIndividualCertification,
  LspIndividualCoaching,
  LspIndividualEducation,
  LspIndividualProject,
  LspIndividualTraining,

  LspOrganizationDetails,
  LspOrganizationAffiliation,
  LspOrganizationAward,
  LspOrganizationCertification,
  LspOrganizationCoaching,
  LspOrganizationEducation,
  LspOrganizationProject,
  LspOrganizationTraining,

  Tag,

  TrainingSource,
  TrainingType,

  Training,
  TrainingDistribution,
  TrainingNominee,
  TrainingTag,
  // views
];
