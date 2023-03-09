import { BudgetModule } from '../api/budget/core/budget.module';
import { ChartOfAccountModule } from '../api/chart-of-accounts/core/chart-of-accounts.module';
import { ContraAccountModule } from '../api/contra-accounts';

export const API_MODULES = [BudgetModule, ContraAccountModule, ChartOfAccountModule];
