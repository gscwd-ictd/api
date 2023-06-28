import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualTrainingsController } from './lsp-individual-trainings.controller';
import { LspIndividualTrainingsService } from './lsp-individual-trainings.service';

@Module({
  imports: [CrudModule.register(LspIndividualTraining)],
  controllers: [LspIndividualTrainingsController],
  providers: [LspIndividualTrainingsService],
  exports: [LspIndividualTrainingsService],
})
export class LspIndividualTrainingsModule {}
