import { Module } from '@nestjs/common';
import { LeaveMonetizationService } from './leave-monetization.service';
import { LeaveMonetizationController } from './leave-monetization.controller';
import { LeaveMonetization } from '@gscwd-api/models';
import { CrudModule } from '@gscwd-api/crud';

@Module({
  imports: [CrudModule.register(LeaveMonetization)],
  providers: [LeaveMonetizationService],
  controllers: [LeaveMonetizationController],
  exports: [LeaveMonetizationService],
})
export class LeaveMonetizationModule {}
