import { BudgetTypeModule } from '../api/budget/budget-types';
import { CostEstimateModule } from '../api/budget/cost-estimates/core/cost-estimates.module';
import { ChartOfAccountModule } from '../api/account-titles/chart-of-accounts/core/chart-of-accounts.module';
import { ContraAccountModule } from '../api/account-titles/contra-accounts';

export const API_MODULES = [BudgetTypeModule, CostEstimateModule, ContraAccountModule, ChartOfAccountModule];
