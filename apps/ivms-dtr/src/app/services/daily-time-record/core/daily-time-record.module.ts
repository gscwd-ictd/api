import { Module } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';
import { DailyTimeRecordController } from './daily-time-record.controller';
import { CrudModule } from '@gscwd-api/crud';
import { IvmsDailyTimeRecord } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(IvmsDailyTimeRecord)],
  providers: [DailyTimeRecordService],
  controllers: [DailyTimeRecordController],
  exports: [DailyTimeRecordService],
})
export class DailyTimeRecordModule {}
