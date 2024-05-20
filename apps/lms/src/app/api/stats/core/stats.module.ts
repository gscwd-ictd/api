import { Module } from '@nestjs/common';
import { TrainingDetailsModule } from '../../training';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TrainingNomineesModule } from '../../training/components/nominees';
import { HrmsEmployeesModule } from '../../../services/hrms';
import { BenchmarkModule } from '../../benchmark';
import { OtherTrainingsModule } from '../../others';
import { BenchmarkParticipantsModule } from '../../benchmark/components/participants';
import { OtherTrainingParticipantsModule } from '../../others/components/other-training-participants';

@Module({
  imports: [
    TrainingDetailsModule,
    TrainingNomineesModule,
    HrmsEmployeesModule,
    BenchmarkModule,
    BenchmarkParticipantsModule,
    OtherTrainingsModule,
    OtherTrainingParticipantsModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
