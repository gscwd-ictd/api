import { Module } from '@nestjs/common';
import { TrainingRequirementsController } from './training-requirements.controller';
import { TrainingRequirementsService } from './training-requirements.service';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingRequirements } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(TrainingRequirements)],
  controllers: [TrainingRequirementsController],
  providers: [TrainingRequirementsService],
  exports: [TrainingRequirementsService],
})
export class TrainingRequirementsModule {}
