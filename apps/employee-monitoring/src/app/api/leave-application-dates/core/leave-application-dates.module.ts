import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplicationDates } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-application-dates/leave-application-dates.entity';
import { LeaveApplicationDatesController } from './leave-application-dates.controller';
import { LeaveApplicationDatesService } from './leave-application-dates.service';

@Module({
  imports: [CrudModule.register(LeaveApplicationDates)],
  providers: [LeaveApplicationDatesService],
  controllers: [LeaveApplicationDatesController],
  exports: [LeaveApplicationDatesService],
})
export class LeaveApplicationDatesModule {}
