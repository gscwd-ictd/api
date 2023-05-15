import { Module } from '@nestjs/common';
import { LeaveApplicationDatesModule } from '../components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../components/leave-benefits/core/leave-benefits.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

@Module({
  imports: [LeaveApplicationModule, LeaveApplicationDatesModule, LeaveBenefitsModule],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveApplicationModule, LeaveApplicationDatesModule, LeaveBenefitsModule],
})
export class LeaveModule {}
