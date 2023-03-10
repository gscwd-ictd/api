import { CrudModule } from '@gscwd-api/crud';
import { BudgetDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BudgetDetailsController } from './budget-details.controller';
import { BudgetDetailsService } from './budget-details.service';

@Module({
  imports: [CrudModule.register(BudgetDetails)],
  controllers: [BudgetDetailsController],
  providers: [BudgetDetailsService],
  exports: [BudgetDetailsService],
})
export class BudgetDetailsModule {}
