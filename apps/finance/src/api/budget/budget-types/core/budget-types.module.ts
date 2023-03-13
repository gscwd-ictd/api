import { CrudModule } from '@gscwd-api/crud';
import { BudgetType } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BudgetTypeController } from './budget-types.controller';
import { BudgetTypeService } from './budget-types.service';

@Module({
  imports: [CrudModule.register(BudgetType)],
  controllers: [BudgetTypeController],
  providers: [BudgetTypeService],
  exports: [BudgetTypeService],
})
export class BudgetTypeModule {}
