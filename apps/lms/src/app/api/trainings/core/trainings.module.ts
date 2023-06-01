import { CrudModule } from '@gscwd-api/crud';
import { Training } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingNomineesModule } from '../components/training-nominees';

@Module({
  imports: [CrudModule.register(Training), TrainingDistributionsModule, TrainingNomineesModule],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
