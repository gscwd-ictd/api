import {
  AccountGroup,
  GeneralLedgerAccount,
  ContraAccount,
  MajorAccountGroup,
  SubMajorAccountGroup,
  ChartOfAccountsView,
  BudgetType,
  BudgetDetails,
  ProjectDetails,
  MaterialCost,
  Contigency,
  LaborCost,
  EquipmentCost,
  ValueAddedTax,
} from '@gscwd-api/models';

export const DB_ENTITIES = [
  //Budget
  BudgetType,
  BudgetDetails,
  ProjectDetails,
  Contigency,
  MaterialCost,
  LaborCost,
  EquipmentCost,
  ValueAddedTax,

  //Chart Of Accounts
  AccountGroup,
  MajorAccountGroup,
  SubMajorAccountGroup,
  ContraAccount,
  GeneralLedgerAccount,

  //table for views
  ChartOfAccountsView,
];
