import { CrudModule } from '@gscwd-api/crud';
import { TrainingIndividualDistribution } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingIndividualDistributionsService } from './training-individual-distributions.service';
import { TrainingIndividualDistributionsController } from './training-individual-distributions.controller';

@Module({
  imports: [CrudModule.register(TrainingIndividualDistribution)],
  controllers: [TrainingIndividualDistributionsController],
  providers: [TrainingIndividualDistributionsService],
  exports: [TrainingIndividualDistributionsService],
})
export class TrainingIndividualDistributionsModule {}
