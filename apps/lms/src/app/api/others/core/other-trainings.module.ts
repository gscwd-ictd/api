import { CrudModule } from '@gscwd-api/crud';
import { OtherTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { OtherTrainingsService } from './other-trainings.service';
import { OtherTrainingsController } from './other-trainings.controller';
import { OtherTrainingParticipantsModule } from '../components/other-training-participants';
import { OtherTrainingParticipantsRequirementsModule } from '../components/other-training-participants-requirements';

@Module({
  imports: [CrudModule.register(OtherTraining), OtherTrainingParticipantsModule, OtherTrainingParticipantsRequirementsModule],
  controllers: [OtherTrainingsController],
  providers: [OtherTrainingsService],
  exports: [OtherTrainingsService],
})
export class OtherTrainingsModule {}
