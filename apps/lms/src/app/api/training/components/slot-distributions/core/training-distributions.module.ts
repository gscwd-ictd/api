import { CrudModule } from '@gscwd-api/crud';
import { TrainingDistribution } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';
import { TrainingRecommendedEmployeesModule } from '../../recommended-employees/core/training-recommended-employees.module';
import { HrmsEmployeesModule } from '../../../../../services/hrms/employees';
import { TrainingNomineesModule } from '../../nominees';

@Module({
  imports: [CrudModule.register(TrainingDistribution), TrainingRecommendedEmployeesModule, TrainingNomineesModule, HrmsEmployeesModule],
  controllers: [],
  providers: [TrainingDistributionsService],
  exports: [TrainingDistributionsService],
})
export class TrainingDistributionsModule {}
