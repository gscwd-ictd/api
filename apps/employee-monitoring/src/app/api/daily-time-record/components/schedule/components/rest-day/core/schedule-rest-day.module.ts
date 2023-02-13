import { CrudModule } from '@gscwd-api/crud';
import { ScheduleRestDay } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ScheduleRestDayController } from './schedule-rest-day.controller';
import { ScheduleRestDayService } from './schedule-rest-day.service';

@Module({
  imports: [CrudModule.register(ScheduleRestDay)],
  providers: [ScheduleRestDayService],
  controllers: [ScheduleRestDayController],
  exports: [ScheduleRestDayService],
})
export class ScheduleRestDayModule {}
