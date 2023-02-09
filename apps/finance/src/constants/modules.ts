import { BudgetModule } from '../api/budget/core/budget.module';
import { ChartOfAccountModule } from '../api/chart-of-accounts/core/chart-of-accounts.module';
import { GeneralLedgerContraAccountTypeModule } from '../api/general-ledger-contra-account-types';

export const API_MODULES = [BudgetModule, GeneralLedgerContraAccountTypeModule, ChartOfAccountModule];
