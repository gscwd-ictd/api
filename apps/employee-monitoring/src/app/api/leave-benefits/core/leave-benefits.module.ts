import { Module } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';
import { LeaveBenefitsController } from './leave-benefits.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveBenefits } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveBenefits)],
  providers: [LeaveBenefitsService],
  controllers: [LeaveBenefitsController],
  exports: [LeaveBenefitsService],
})
export class LeaveBenefitsModule {}
