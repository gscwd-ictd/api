import { Module } from '@nestjs/common';
import { TrainingLspIndividualService } from './training-lsp-individual.service';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingLspIndividual } from '@gscwd-api/models';
import { TrainingLspIndividualController } from './training-lsp-individual.controller';

@Module({
  imports: [CrudModule.register(TrainingLspIndividual)],
  controllers: [TrainingLspIndividualController],
  providers: [TrainingLspIndividualService],
  exports: [TrainingLspIndividualService],
})
export class TrainingLspIndividualModule {}
