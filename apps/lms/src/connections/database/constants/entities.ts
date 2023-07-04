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
  TrainingIndividualDetails,
  TrainingIndividualDistribution,
  TrainingIndividualNominee,
  TrainingIndividualTag,
  TrainingSource,
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

  TrainingIndividualDetails,
  TrainingIndividualDistribution,
  TrainingIndividualNominee,
  TrainingIndividualTag,
  // views
];
