import { Module } from '@nestjs/common';
import { LeaveMonetizationService } from './leave-monetization.service';
import { LeaveMonetizationController } from './leave-monetization.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveMonetization } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveMonetization)],
  providers: [LeaveMonetizationService],
  controllers: [LeaveMonetizationController]
})
export class LeaveMonetizationModule { }
