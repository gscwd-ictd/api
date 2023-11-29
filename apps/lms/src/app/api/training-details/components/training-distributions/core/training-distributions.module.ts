import { CrudModule } from '@gscwd-api/crud';
import { TrainingDistribution } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';
import { TrainingRecommendedEmployeesModule } from '../../training-recommended-employees/core/training-recommended-employees.module';
import { TrainingDistributionsController } from './training-distributions.controller';
import { HrmsEmployeesModule } from '../../../../../services/hrms/employees';
import { TrainingDistributionsMicroserviceController } from './training-distribution-ms.controller';

@Module({
  imports: [CrudModule.register(TrainingDistribution), TrainingRecommendedEmployeesModule, HrmsEmployeesModule],
  controllers: [TrainingDistributionsController, TrainingDistributionsMicroserviceController],
  providers: [TrainingDistributionsService],
  exports: [TrainingDistributionsService],
})
export class TrainingDistributionsModule {}
