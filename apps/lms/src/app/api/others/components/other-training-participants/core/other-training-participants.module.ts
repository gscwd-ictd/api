import { CrudModule } from '@gscwd-api/crud';
import { OtherTrainingParticipant } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { OtherTrainingParticipantsService } from './other-training-participants.service';
import { HrmsEmployeesModule } from '../../../../../services/hrms';
import { OtherTrainingParticipantsRequirementsModule } from '../../other-training-participants-requirements';

@Module({
  imports: [CrudModule.register(OtherTrainingParticipant), HrmsEmployeesModule, OtherTrainingParticipantsRequirementsModule],
  controllers: [],
  exports: [OtherTrainingParticipantsService],
  providers: [OtherTrainingParticipantsService],
})
export class OtherTrainingParticipantsModule {}
