import { Module } from '@nestjs/common';
import { LeaveApplicationDatesModule } from '../components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../components/leave-application/core/leave-application.module';
import { LeaveService } from './leave.service';

@Module({
  imports: [LeaveApplicationModule, LeaveApplicationDatesModule],
  providers: [LeaveService],
})
export class LeaveModule {}
