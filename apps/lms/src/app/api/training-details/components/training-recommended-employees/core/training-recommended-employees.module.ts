import { CrudModule } from '@gscwd-api/crud';
import { TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingRecommendedEmployeesController } from './training-recommended-employees.controller';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';
import { PortalEmployeesModule } from '../../../../../services/portal/portal-employees';

@Module({
  imports: [CrudModule.register(TrainingRecommendedEmployee), PortalEmployeesModule],
  controllers: [TrainingRecommendedEmployeesController],
  providers: [TrainingRecommendedEmployeeService],
  exports: [TrainingRecommendedEmployeeService],
})
export class TrainingRecommendedEmployeesModule {}
