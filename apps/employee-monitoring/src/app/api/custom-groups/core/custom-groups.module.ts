import { Module } from '@nestjs/common';
import { CustomGroupsService } from './custom-groups.service';
import { CustomGroupsController } from './custom-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { CustomGroups } from '@gscwd-api/models';
import { CustomGroupMembersModule } from '../components/custom-group-members/core/custom-group-members.module';
import { ScheduleSheetModule } from '../../daily-time-record/components/schedule-sheet/core/schedule-sheet.module';

@Module({
  imports: [CrudModule.register(CustomGroups), CustomGroupMembersModule, ScheduleSheetModule],
  providers: [CustomGroupsService],
  controllers: [CustomGroupsController],
  exports: [CustomGroupsService],
})
export class CustomGroupsModule {}
