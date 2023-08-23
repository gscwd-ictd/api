import { ViewColumn, ViewEntity } from 'typeorm';
import { TrainingDetails, TrainingDistribution, TrainingSource, TrainingTag, TrainingType } from '../data';

@ViewEntity({
  name: 'training_details_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('training_details.created_at', 'created_at')
      .addSelect('training_details.updated_at', 'updated_at')
      .addSelect('training_details.deleted_at', 'deleted_at')
      .addSelect('training_details.training_details_id', 'training_details_id')
      .from(TrainingDetails, 'training_details')
      .innerJoin(TrainingSource, 'training_source', 'training_details.training_source_id_fk = training_source.training_source_id')
      .innerJoin(TrainingType, 'training_type', 'training_details.training_type_id_fk = training_type.training_type_id')
      .innerJoin(TrainingTag, 'training_tag', 'training_details.training_details_id = training_tag.training_details_id_fk')
      .innerJoin(
        TrainingDistribution,
        'training_distribution',
        'training_details.training_details_id = training_distribution.training_details_id_fk'
      ),
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
}

/* SELECT PD.PROJECT_NAME,
	PD.LOCATION,
	PD.SUBJECT,
	PD.WORK_DESCRIPTION,
	PD.QUANTITY,
	PD.OUTPUT_PER_DAY,
	BD.STATUS,
	BT.NAME,
	GL.NAME,
	MC.SPECIFICATION_ID,
	MC.QUANTITY,
	MC.UNIT_COST,
	LC.SPECIFICATION_ID,
	LC.NUMBER_OF_PERSON,
	LC.NUMBER_OF_DAYS,
	LC.UNIT_COST,
	EC.EQUIPMENT_DESCRIPTION,
	EC.NUMBER_OF_UNIT,
	EC.number_of_days,
	EC.UNIT_COST
FROM PROJECT_DETAILS AS PD
INNER JOIN BUDGET_DETAILS AS BD ON BD.BUDGET_DETAILS_ID = PD.BUDGET_DETAILS_ID_FK
INNER JOIN BUDGET_TYPES AS BT ON BT.BUDGET_TYPE_ID = BD.BUDGET_TYPE_ID_FK
INNER JOIN GENERAL_LEDGER_ACCOUNTS AS GL ON GL.GENERAL_LEDGER_ACCOUNT_ID = BD.GENERAL_LEDGER_ACCOUNT_ID_FK
INNER JOIN MATERIAL_COSTS AS MC ON MC.PROJECT_DETAILS_ID_FK = PD.PROJECT_DETAILS_ID
INNER JOIN LABOR_COSTS AS LC ON LC.PROJECT_DETAILS_ID_FK = PD.PROJECT_DETAILS_ID
INNER JOIN EQUIPMENT_COSTS AS EC ON EC.PROJECT_DETAIL_ID_FK = PD.PROJECT_DETAILS_ID */
