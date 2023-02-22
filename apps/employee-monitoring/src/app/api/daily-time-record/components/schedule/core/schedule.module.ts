import { CrudModule } from '@gscwd-api/crud';
import { Schedule } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [CrudModule.register(Schedule)],
  exports: [ScheduleService],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
