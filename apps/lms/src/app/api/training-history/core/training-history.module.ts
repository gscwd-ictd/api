import { Module } from '@nestjs/common';
import { TrainingHistoryService } from './training-history.service';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingHistory } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(TrainingHistory)],
  controllers: [],
  providers: [TrainingHistoryService],
  exports: [TrainingHistoryService],
})
export class TrainingHistoryModule {}
