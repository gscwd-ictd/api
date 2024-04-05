import { CrudModule } from '@gscwd-api/crud';
import { Benchmark } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { BenchmarkController } from './benchmark.controller';
import { BenchmarkService } from './benchmark.service';
import { BenchmarkParticipantsModule } from '../components/participants';
import { BenchmarkParticipantRequirementsModule } from '../components/participants-requirements';

@Module({
  imports: [CrudModule.register(Benchmark), BenchmarkParticipantsModule, BenchmarkParticipantRequirementsModule],
  controllers: [BenchmarkController],
  providers: [BenchmarkService],
  exports: [BenchmarkService],
})
export class BenchmarkModule {}
