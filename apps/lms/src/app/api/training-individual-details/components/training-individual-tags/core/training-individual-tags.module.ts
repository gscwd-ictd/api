import { CrudModule } from '@gscwd-api/crud';
import { TrainingIndividualTag } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingIndividualTagsService } from './training-individual-tags.service';
import { TrainingIndividualTagsController } from './training-individual-tags.controller';

@Module({
  imports: [CrudModule.register(TrainingIndividualTag)],
  controllers: [TrainingIndividualTagsController],
  providers: [TrainingIndividualTagsService],
  exports: [TrainingIndividualTagsService],
})
export class TrainingIndividualTagsModule {}
