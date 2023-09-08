import { ViewColumn, ViewEntity } from 'typeorm';
import {
  TrainingDetails,
  TrainingDistribution,
  TrainingLspIndividual,
  TrainingLspOrganization,
  TrainingSource,
  TrainingTag,
  TrainingType,
} from '../data';

@ViewEntity({
  name: 'training_details_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('training_details.created_at', 'created_at')
      .addSelect('training_details.updated_at', 'updated_at')
      .addSelect('training_details.deleted_at', 'deleted_at')
      .addSelect('training_details.training_details_id', 'training_details_id')
      .addSelect('training_sources.training_source_id')
      .addSelect('training_sources.name, training_source_name')
      .addSelect('training_types.training_type_id, training_type_id')
      .addSelect('training_types.name', 'training_type_name')
      .addSelect(
        'coalesce(get_lsp(training_lsp_individual.lsp_individual_details_id_fk), get_lsp(training_lsp_organization.lsp_organization_details_id_fk)) as lsp'
      )
      .from(TrainingDetails, 'training_details')
      .leftJoin(TrainingLspIndividual, 'training_details.training_details_id = training_lsp_individual.training_details_id_fk')
      .leftJoin(TrainingLspOrganization, 'training_details.training_details_id = training_lsp_organization.training_details_id_fk'),
})
export class TrainingDetailsView {
  @ViewColumn()
  createdAt: string;

  @ViewColumn()
  updatedAt: string;

  @ViewColumn()
  deletedAt: string;

  @ViewColumn()
  id: string;

  @ViewColumn()
  trainingSource: string;

  @ViewColumn()
  trainingType: string;
}

/* 
  
  SELECT TRAINING_DETAILS.CREATED_AT,
	TRAINING_DETAILS.UPDATED_AT,
	TRAINING_DETAILS.DELETED_AT,
	TRAINING_DETAILS.TRAINING_DETAILS_ID,
	TRAINING_SOURCE_ID_FK,
	TRAINING_SOURCES.NAME,
	TRAINING_TYPE_ID_FK,
	TRAINING_TYPES.NAME,
	COALESCE(GET_LSP(TRAINING_LSP_INDIVIDUAL.LSP_INDIVIDUAL_DETAILS_ID_FK),

		GET_LSP(TRAINING_LSP_ORGANIZATION.lsp_organization_details_id_fk)) AS LSP,
	TRAINING_DETAILS.LOCATION,
	TRAINING_DETAILS.COURSE_TITLE,
	TRAINING_DETAILS.TRAINING_START,
	TRAINING_DETAILS.TRAINING_END,
	TRAINING_DETAILS.NUMBER_OF_HOURS,
	TRAINING_DETAILS.COURSE_CONTENT,
	TRAINING_DETAILS.DEADLINE_FOR_SUBMISSION,
	TRAINING_DETAILS.INVITATION_URL,
	TRAINING_DETAILS.NUMBER_OF_PARTICIPANTS,
	TRAINING_DETAILS.POST_TRAINING_REQUIREMENTS,
	TRAINING_DETAILS.STATUS,
	TRAINING_TAGS.TRAINING_TAG_ID,
	TRAINING_DISTRIBUTIONS.TRAINING_DISTRIBUTION_ID,
	TRAINING_DISTRIBUTIONS.NO_OF_SLOTS,
	TRAINING_RECOMMENDED_EMPLOYEES.EMPLOYEE_ID_FK
FROM TRAINING_DETAILS
INNER JOIN TRAINING_SOURCES ON TRAINING_DETAILS.TRAINING_SOURCE_ID_FK = TRAINING_SOURCES.TRAINING_SOURCE_ID
INNER JOIN TRAINING_TYPES ON TRAINING_DETAILS.TRAINING_TYPE_ID_FK = TRAINING_TYPES.TRAINING_TYPE_ID
LEFT JOIN TRAINING_LSP_INDIVIDUAL ON TRAINING_DETAILS.TRAINING_DETAILS_ID = TRAINING_LSP_INDIVIDUAL.TRAINING_DETAILS_ID_FK
LEFT JOIN TRAINING_LSP_ORGANIZATION ON TRAINING_DETAILS.TRAINING_DETAILS_ID = TRAINING_LSP_ORGANIZATION.TRAINING_DETAILS_ID_FK
INNER JOIN TRAINING_TAGS ON TRAINING_DETAILS.TRAINING_DETAILS_ID = TRAINING_TAGS.TRAINING_DETAILS_ID_FK
INNER JOIN TRAINING_DISTRIBUTIONS ON TRAINING_DETAILS.TRAINING_DETAILS_ID = TRAINING_DISTRIBUTIONS.TRAINING_DETAILS_ID_FK
INNER JOIN TRAINING_RECOMMENDED_EMPLOYEES ON TRAINING_DISTRIBUTIONS.TRAINING_DISTRIBUTION_ID = TRAINING_RECOMMENDED_EMPLOYEES.TRAINING_DISTRIBUTION_ID_FK
*/
