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
import { ProjectDetails } from '../api/budgets/cost-estimates/components/project-details';
import { ValueAddedTax } from '../api/budgets/cost-estimates/components/value-added-tax';

export const DB_ENTITIES = [
  //Budget
  BudgetType,
  BudgetDetails,

  EquipmentCost,
  LaborCost,
  LaborType,
  ProjectDetails,
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
