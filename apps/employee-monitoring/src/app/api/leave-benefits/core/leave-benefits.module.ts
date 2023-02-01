import { Module } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';
import { LeaveBenefitsController } from './leave-benefits.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveBenefits } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-benefits/leave-benefits.entity';

@Module({
  imports: [CrudModule.register(LeaveBenefits)],
  providers: [LeaveBenefitsService],
  controllers: [LeaveBenefitsController],
  exports: [LeaveBenefitsService],
})
export class LeaveBenefitsModule {}
