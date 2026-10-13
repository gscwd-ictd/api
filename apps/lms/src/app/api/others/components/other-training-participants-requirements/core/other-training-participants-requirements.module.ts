import { Module } from '@nestjs/common';
import { OtherTrainingParticipantsRequirementsService } from './other-training-participants-requirements.service';
import { CrudModule } from '@gscwd-api/crud';
import { OtherTrainingParticipantRequirements } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OtherTrainingParticipantRequirements)],
  controllers: [],
  providers: [OtherTrainingParticipantsRequirementsService],
  exports: [OtherTrainingParticipantsRequirementsService],
})
export class OtherTrainingParticipantsRequirementsModule {}
