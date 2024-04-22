import { CrudModule } from '@gscwd-api/crud';
import { BenchmarkParticipants } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BenchmarkParticipantsService } from './participants.service';
import { BenchmarkParticipantRequirementsModule } from '../../participants-requirements';
import { HrmsEmployeesModule } from '../../../../../services/hrms';

@Module({
  imports: [CrudModule.register(BenchmarkParticipants), BenchmarkParticipantRequirementsModule, HrmsEmployeesModule],
  controllers: [],
  providers: [BenchmarkParticipantsService],
  exports: [BenchmarkParticipantsService],
})
export class BenchmarkParticipantsModule {}
