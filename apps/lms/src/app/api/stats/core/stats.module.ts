import { Module } from '@nestjs/common';
import { TrainingDetailsModule } from '../../training';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TrainingNomineesModule } from '../../training/components/nominees';
import { HrmsEmployeesModule } from '../../../services/hrms';
import { BenchmarkModule } from '../../benchmark';
import { OtherTrainingsModule } from '../../others';

@Module({
  imports: [TrainingDetailsModule, TrainingNomineesModule, HrmsEmployeesModule, BenchmarkModule, OtherTrainingsModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
