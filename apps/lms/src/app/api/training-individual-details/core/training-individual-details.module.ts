import { CrudModule } from '@gscwd-api/crud';
import { TrainingIndividualDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingIndividualDetailsService } from './training-individual-details.service';
import { TrainingIndividualDetailsController } from './training-individual-details.controller';
import { TrainingIndividualDistributionsModule } from '../components/training-individual-distributions';
import { TrainingIndividualNomineesModule } from '../components/training-individual-nominees';
import { TrainingIndividualTagsModule } from '../components/training-individual-tags';

@Module({
  imports: [
    CrudModule.register(TrainingIndividualDetails),
    TrainingIndividualDistributionsModule,
    TrainingIndividualNomineesModule,
    TrainingIndividualTagsModule,
  ],
  controllers: [TrainingIndividualDetailsController],
  providers: [TrainingIndividualDetailsService],
  exports: [TrainingIndividualDetailsService],
})
export class TrainingIndividualDetailsModule {}
