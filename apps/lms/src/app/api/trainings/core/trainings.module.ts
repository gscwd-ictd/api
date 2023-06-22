import { CrudModule } from '@gscwd-api/crud';
import { Training } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingNomineesModule } from '../components/training-nominees';
import { TrainingTagsModule } from '../components/training-tags/core/training-tags.module';

@Module({
  imports: [CrudModule.register(Training), TrainingDistributionsModule, TrainingNomineesModule, TrainingTagsModule],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
