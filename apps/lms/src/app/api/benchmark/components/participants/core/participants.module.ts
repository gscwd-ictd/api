import { CrudModule } from '@gscwd-api/crud';
import { BenchmarkParticipants } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BenchmarkParticipantsService } from './participants.service';

@Module({
  imports: [CrudModule.register(BenchmarkParticipants)],
  controllers: [],
  providers: [BenchmarkParticipantsService],
  exports: [BenchmarkParticipantsService],
})
export class BenchmarkParticipantsModule {}
