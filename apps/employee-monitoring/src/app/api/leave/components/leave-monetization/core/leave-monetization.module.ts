import { Module } from '@nestjs/common';
import { LeaveMonetizationService } from './leave-monetization.service';
import { LeaveMonetizationController } from './leave-monetization.controller';

@Module({
  imports: [CrudModule.register(LeaveMonetization)],
  providers: [LeaveMonetizationService],
  controllers: [LeaveMonetizationController]
})
export class LeaveMonetizationModule {}
