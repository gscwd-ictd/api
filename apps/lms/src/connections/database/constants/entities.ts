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
  TrainingRecommendedEmployee,
  TrainingDetailsView,
  TrainingDesign,
} from '@gscwd-api/models';
import { TrainingDetailsTestView } from 'apps/lms/src/app/api/training-details-test/data/training-details-test.view';

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

  TrainingDesign,
  TrainingDetails,
  TrainingLspIndividual,
  TrainingLspOrganization,
  TrainingDistribution,
  TrainingRecommendedEmployee,
  TrainingNominee,
  TrainingTag,

  TrainingDetailsTestView,
  // views
];
