import { CrudModule } from '@gscwd-api/crud';
import { TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingRecommendedEmployeesController } from './training-recommended-employees.controller';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';
import { HrmsEmployeesModule } from '../../../../../services/hrms/employees';
import { TrainingRecommendedEmployeesMicroserviceController } from './training-recommended-employees-ms.controller';

@Module({
  imports: [CrudModule.register(TrainingRecommendedEmployee), HrmsEmployeesModule],
  controllers: [TrainingRecommendedEmployeesController, TrainingRecommendedEmployeesMicroserviceController],
  providers: [TrainingRecommendedEmployeeService],
  exports: [TrainingRecommendedEmployeeService],
})
export class TrainingRecommendedEmployeesModule {}
