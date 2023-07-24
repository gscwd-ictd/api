import { Module } from '@nestjs/common';
import { LeaveCreditEarningsController } from './leave_credit_earnings.controller';
import { LeaveCreditEarningsService } from './leave_credit_earnings.service';

@Module({
  controllers: [LeaveCreditEarningsController],
  providers: [LeaveCreditEarningsService]
})
export class LeaveCreditEarningsModule {}
