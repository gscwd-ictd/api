import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { LeaveApplication } from '../../../../../../../libs/models/src/lib/databases/employee-monitoring/data/leave-application/leave-application.entity';
import { LeaveApplicationController } from './leave-application.controller';
import { LeaveApplicationService } from './leave-application.service';

@Module({
  imports: [CrudModule.register(LeaveApplication)],
  providers: [LeaveApplicationService],
  controllers: [LeaveApplicationController],
  exports: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
