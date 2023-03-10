import { CrudModule } from '@gscwd-api/crud';
import { BudgetDetail } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BudgetDetailController } from './budget-details.controller';
import { BudgetDetailService } from './budget-details.service';

@Module({
  imports: [CrudModule.register(BudgetDetail)],
  controllers: [BudgetDetailController],
  providers: [BudgetDetailService],
  exports: [BudgetDetailService],
})
export class BudgetDetailModule {}
