import { ViewColumn, ViewEntity } from 'typeorm';
import { BudgetDetails, BudgetType, EquipmentCost, GeneralLedgerAccount, LaborCost, MaterialCost, ProjectDetails } from '../data';

@ViewEntity({
  name: 'cost_estimates_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('pd.project_details_id', 'project_details_id')
      .addSelect('pd.project_name', 'pd_project_name')
      .addSelect('pd.location', 'pd_location')
      .addSelect('pd.subject', 'pd_subject')
      .addSelect('pd.work_description', 'pd_work_description')
      .addSelect('pd.quantity', 'pd_quantity')
      .addSelect('pd.unit_measurement', 'pd_unit_measurement')
      .addSelect('pd.output_per_day', 'pd_output_per_day')
      .addSelect('bd.status', 'bd_status')
      .addSelect('bt.name', 'bt_name')
      .addSelect('gl.name', 'gl_name')
      .addSelect('mc.specification_id', 'mc_specification_id')
      .addSelect('mc.quantity', 'mc_quantity')
      .addSelect('mc.unit_cost', 'mc_unit_cost')
      .addSelect('lc.specification_id', 'lc_specification_id')
      .addSelect('lc.number_of_person', 'lc_number_of_person')
      .addSelect('lc.number_of_days', 'lc_number_of_days')
      .addSelect('lc.unit_cost', 'lc_unit_cost')
      .addSelect('ec.equipment_description', 'ec_equipment_description')
      .addSelect('ec.number_of_unit', 'ec_number_of_unit')
      .addSelect('ec.number_of_days', 'ec_number_of_days')
      .addSelect('ec.unit_cost', 'ec_unit_cost')
      .from(ProjectDetails, 'pd')
      .innerJoin(BudgetDetails, 'bd', 'bd.budget_details_id = pd.budget_details_id_fk')
      .innerJoin(BudgetType, 'bt', 'bt.budget_type_id = bd.budget_type_id_fk')
      .innerJoin(GeneralLedgerAccount, 'gl', 'gl.general_ledger_account_id = bd.general_ledger_account_id_fk')
      .innerJoin(MaterialCost, 'mc', 'mc.project_details_id_fk = pd.project_details_id')
      .innerJoin(LaborCost, 'lc', 'lc.project_details_id_fk = pd.project_details_id')
      .innerJoin(EquipmentCost, 'ec', 'ec.project_details_id_fk = pd.project_details_id'),
})
export class CostEstimatesView {
  @ViewColumn()
  project_details_id: string;

  @ViewColumn()
  pd_project_name: string;

  @ViewColumn()
  pd_location: string;

  @ViewColumn()
  pd_subject: string;

  @ViewColumn()
  pd_work_description: string;

  @ViewColumn()
  pd_quantity: number;

  @ViewColumn()
  pd_unit_measurement: string;

  @ViewColumn()
  pd_output_per_day: string;

  @ViewColumn()
  bd_status: string;

  @ViewColumn()
  bt_name: string;

  @ViewColumn()
  gl_name: string;

  @ViewColumn()
  mc_specification_id: string;

  @ViewColumn()
  mc_quantity: number;

  @ViewColumn()
  mc_unit_cost: number;

  @ViewColumn()
  lc_specification_id: string;

  @ViewColumn()
  lc_number_of_person: number;

  @ViewColumn()
  lc_number_of_days: number;

  @ViewColumn()
  lc_unit_cost: number;

  @ViewColumn()
  ec_equipment_description: string;

  @ViewColumn()
  ec_number_of_unit: number;

  @ViewColumn()
  ec_number_of_days: number;

  @ViewColumn()
  ec_unit_cost: number;
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
