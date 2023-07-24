import { CrudModule } from '@gscwd-api/crud';
import { ScheduleSheetView } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ScheduleSheetService } from './schedule-sheet.service';

@Module({
  imports: [CrudModule.register(ScheduleSheetView)],
  providers: [ScheduleSheetService],
  exports: [ScheduleSheetService],
})
export class ScheduleSheetModule {}
