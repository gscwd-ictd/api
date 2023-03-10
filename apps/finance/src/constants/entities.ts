import {
  AccountGroup,
  GeneralLedgerAccount,
  ContraAccount,
  MajorAccountGroup,
  SubMajorAccountGroup,
  ChartOfAccountsView,
  BudgetType,
  BudgetDetails,
} from '@gscwd-api/models';
import { EquipmentCost } from '../api/budgets/cost-estimates/components/equipment-cost';
import { LaborCost } from '../api/budgets/cost-estimates/components/labor-cost';
import { LaborType } from '../api/budgets/cost-estimates/components/labor-type';
import { MaterialCost } from '../api/budgets/cost-estimates/components/material-cost';
import { ProjectDetail } from '../api/budgets/cost-estimates/components/project-detail';
import { ValueAddedTax } from '../api/budgets/cost-estimates/components/value-added-tax';

export const DB_ENTITIES = [
  //Budget
  BudgetType,
  BudgetDetails,

  EquipmentCost,
  LaborCost,
  LaborType,
  ProjectDetail,
  ValueAddedTax,
  MaterialCost,

  //Chart Of Accounts
  AccountGroup,
  MajorAccountGroup,
  SubMajorAccountGroup,
  ContraAccount,
  GeneralLedgerAccount,
  ChartOfAccountsView,
];
