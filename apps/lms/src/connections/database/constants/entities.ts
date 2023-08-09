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
  TrainingDetails,
  TrainingDistribution,
  TrainingNominee,
  TrainingTag,
  TrainingSource,
  TrainingType,
  LspOrganizationDetails,
  LspOrganizationAffiliation,
  LspOrganizationAward,
  LspOrganizationCertification,
  LspOrganizationCoaching,
  LspOrganizationTraining,
  TrainingLspIndividual,
  TrainingLspOrganization,
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
  LspOrganizationTraining,

  Tag,

  TrainingSource,
  TrainingType,

  TrainingDetails,
  TrainingLspIndividual,
  TrainingLspOrganization,
  TrainingDistribution,
  TrainingNominee,
  TrainingTag,
  // views
];
