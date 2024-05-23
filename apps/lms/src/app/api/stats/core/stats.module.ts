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
import { LspRatingModule } from '../../lsp-rating';
import { LspDetailsModule } from '../../lsp-details';
import { CrudModule } from '@gscwd-api/crud';
import { LspRankView } from '@gscwd-api/models';

@Module({
  imports: [
    CrudModule.register(LspRankView),
    TrainingDetailsModule,
    TrainingNomineesModule,
    HrmsEmployeesModule,
    BenchmarkModule,
    BenchmarkParticipantsModule,
    OtherTrainingsModule,
    OtherTrainingParticipantsModule,
    LspRatingModule,
    LspDetailsModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
