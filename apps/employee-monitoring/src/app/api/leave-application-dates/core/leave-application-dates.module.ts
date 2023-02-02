import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplicationDates } from '@gscwd-api/models';
import { LeaveApplicationDatesController } from './leave-application-dates.controller';
import { LeaveApplicationDatesService } from './leave-application-dates.service';

@Module({
  imports: [CrudModule.register(LeaveApplicationDates)],
  providers: [LeaveApplicationDatesService],
  controllers: [LeaveApplicationDatesController],
  exports: [LeaveApplicationDatesService],
})
export class LeaveApplicationDatesModule {}
