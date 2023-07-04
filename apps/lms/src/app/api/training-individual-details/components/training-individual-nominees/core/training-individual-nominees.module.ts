import { CrudModule } from '@gscwd-api/crud';
import { TrainingIndividualNominee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingIndividualNomineesService } from './training-individual-nominees.service';
import { TrainingIndividualNomineesController } from './training-individual-nominees.controller';

@Module({
  imports: [CrudModule.register(TrainingIndividualNominee)],
  controllers: [TrainingIndividualNomineesController],
  providers: [TrainingIndividualNomineesService],
  exports: [TrainingIndividualNomineesService],
})
export class TrainingIndividualNomineesModule {}
