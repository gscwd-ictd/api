import { CrudModule } from '@gscwd-api/crud';
import { TrainingNominee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { HrmsEmployeesModule } from '../../../../../services/hrms';
import { TrainingDistributionsModule } from '../../slot-distributions';
import { TrainingRequirementsModule } from '../../requirements';

@Module({
  imports: [CrudModule.register(TrainingNominee), HrmsEmployeesModule, TrainingDistributionsModule, TrainingRequirementsModule],
  controllers: [],
  providers: [TrainingNomineesService],
  exports: [TrainingNomineesService],
})
export class TrainingNomineesModule {}
