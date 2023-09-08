import { Module } from '@nestjs/common';
import { TrainingDetailsTestService } from './training-details-test.service';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetailsTestView } from '../data/training-details-test.view';
import { TrainingDetailsTestController } from './training-details-test.controller';

@Module({
  imports: [CrudModule.register(TrainingDetailsTestView)],
  controllers: [TrainingDetailsTestController],
  providers: [TrainingDetailsTestService],
  exports: [TrainingDetailsTestService],
})
export class TrainingDetailsTestModule {}
