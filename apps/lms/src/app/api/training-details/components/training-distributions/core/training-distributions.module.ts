import { CrudModule } from '@gscwd-api/crud';
import { TrainingDistribution } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';
import { TrainingDistributionsController } from './training-distributions.controller';

@Module({
  imports: [CrudModule.register(TrainingDistribution)],
  controllers: [TrainingDistributionsController],
  providers: [TrainingDistributionsService],
  exports: [TrainingDistributionsService],
})
export class TrainingDistributionsModule {}
