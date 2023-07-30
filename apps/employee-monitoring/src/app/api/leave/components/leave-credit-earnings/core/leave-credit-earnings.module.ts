import { CrudModule } from '@gscwd-api/crud';
import { LeaveCreditEarnings } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LeaveCreditEarningsController } from './leave-credit-earnings.controller';
import { LeaveCreditEarningsService } from './leave-credit-earnings.service';

@Module({
  imports: [CrudModule.register(LeaveCreditEarnings)],
  controllers: [LeaveCreditEarningsController],
  providers: [LeaveCreditEarningsService],
  exports: [LeaveCreditEarningsService],
})
export class LeaveCreditEarningsModule {}
