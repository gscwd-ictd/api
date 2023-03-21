import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { ChartOfAccountModule } from './api/account-titles/chart-of-accounts';
import { ContraAccountModule } from './api/account-titles/contra-accounts';
import { BudgetTypeModule } from './api/budget/budget-types';
import { CostEstimateModule } from './api/budget/cost-estimates';
import { ItemModule } from './api/item';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/finance/.env') }),

    // database connection via typeorm
    DatabaseModule,

    // API modules
    ContraAccountModule,
    ChartOfAccountModule,
    ItemModule,
    BudgetTypeModule,
    CostEstimateModule,
  ],
})
export class AppModule {}
