import { Module } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';
import { LeaveBenefitsController } from './leave-benefits.controller';

@Module({
  providers: [LeaveBenefitsService],
  controllers: [LeaveBenefitsController],
})
export class LeaveBenefitsModule {}
