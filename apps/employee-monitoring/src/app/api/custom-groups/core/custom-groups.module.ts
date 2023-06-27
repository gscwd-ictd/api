import { Module } from '@nestjs/common';
import { CustomGroupsService } from './custom-groups.service';
import { CustomGroupsController } from './custom-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { CustomGroups } from '@gscwd-api/models';
import { CustomGroupMembersModule } from '../components/custom-group-members/core/custom-group-members.module';
import { ScheduleSheetModule } from '../../daily-time-record/components/schedule-sheet/core/schedule-sheet.module';
import { EmployeeRestDaysModule } from '../../daily-time-record/components/employee-schedule/components/employee-rest-day/components/employee-rest-days/core/employee-rest-days.module';

@Module({
  imports: [CrudModule.register(CustomGroups), CustomGroupMembersModule, ScheduleSheetModule, EmployeeRestDaysModule],
  providers: [CustomGroupsService],
  controllers: [CustomGroupsController],
  exports: [CustomGroupsService],
})
export class CustomGroupsModule {}
