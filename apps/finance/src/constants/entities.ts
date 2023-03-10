import {
  AccountGroup,
  GeneralLedgerAccount,
  ContraAccount,
  MajorAccountGroup,
  SubMajorAccountGroup,
  ChartOfAccountsView,
  BudgetType,
} from '@gscwd-api/models';
import { EquipmentCost } from '../api/budget/components/equipment-cost';
import { LaborCost } from '../api/budget/components/labor-cost';
import { LaborType } from '../api/budget/components/labor-type';
import { MaterialCost } from '../api/budget/components/material-cost';
import { ProjectDetail } from '../api/budget/components/project-detail';
import { ValueAddedTax } from '../api/budget/components/value-added-tax';

export const DB_ENTITIES = [
  //Budget
  BudgetType,

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
