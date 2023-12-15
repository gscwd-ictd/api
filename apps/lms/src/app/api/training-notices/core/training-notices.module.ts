import { Module } from '@nestjs/common';
import { TrainingNoticesController } from './training-notices.controller';
import { TrainingDetailsModule } from '../../training-details/core/training-details.module';
import { TrainingNoticesService } from './training-notices.service';
import { TrainingLspDetailsModule } from '../../training-details/components/training-lsp-details';
import { TrainingTagsModule } from '../../training-details/components/training-tags';
import { TrainingDistributionsModule } from '../../training-details/components/training-distributions';

@Module({
  imports: [TrainingDetailsModule, TrainingLspDetailsModule, TrainingTagsModule, TrainingDistributionsModule],
  controllers: [TrainingNoticesController],
  providers: [TrainingNoticesService],
  exports: [TrainingNoticesService],
})
export class TrainingNoticesModule {}
