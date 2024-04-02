import { CrudModule } from '@gscwd-api/crud';
import { TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';
import { HrmsEmployeesModule } from '../../../../../services/hrms/employees';

@Module({
  imports: [CrudModule.register(TrainingRecommendedEmployee), HrmsEmployeesModule],
  controllers: [],
  providers: [TrainingRecommendedEmployeeService],
  exports: [TrainingRecommendedEmployeeService],
})
export class TrainingRecommendedEmployeesModule {}
