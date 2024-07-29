import { Module } from '@nestjs/common';
import { TrainingHistoryController } from './training-history.controller';
import { TrainingHistoryService } from './training-history.service';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingHistory } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(TrainingHistory)],
  controllers: [TrainingHistoryController],
  providers: [TrainingHistoryService],
  exports: [TrainingHistoryService],
})
export class TrainingHistoryModule {}
