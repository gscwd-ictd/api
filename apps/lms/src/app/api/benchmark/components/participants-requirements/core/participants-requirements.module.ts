import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { BenchmarkParticipantRequirementsService } from './participants-requirements.service';
import { BenchmarkParticipantRequirements } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(BenchmarkParticipantRequirements)],
  controllers: [],
  providers: [BenchmarkParticipantRequirementsService],
  exports: [BenchmarkParticipantRequirementsService],
})
export class BenchmarkParticipantRequirementsModule {}
