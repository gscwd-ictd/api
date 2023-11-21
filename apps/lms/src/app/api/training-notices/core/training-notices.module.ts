import { Module } from '@nestjs/common';
import { TrainingNoticesController } from './training-notices.controller';
import { TrainingDetailsModule } from '../../training-details/core/training-details.module';

@Module({
  imports: [TrainingDetailsModule],
  controllers: [TrainingNoticesController],
  providers: [],
  exports: [],
})
export class TrainingNoticesModule {}
