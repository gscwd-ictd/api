import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingNomineesModule } from '../components/training-nominees';
import { TrainingTagsModule } from '../components/training-tags';

@Module({
  imports: [CrudModule.register(TrainingDetails), TrainingDistributionsModule, TrainingNomineesModule, TrainingTagsModule],
  controllers: [TrainingDetailsController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
