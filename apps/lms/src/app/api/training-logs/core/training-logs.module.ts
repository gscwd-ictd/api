import { Module } from '@nestjs/common';
import { TrainingLogsController } from './training-logs.controller';
import { TrainingLogsService } from './training-logs.service';

@Module({
  imports: [],
  controllers: [TrainingLogsController],
  providers: [TrainingLogsService],
  exports: [],
})
export class TrainingLogsModule {}
