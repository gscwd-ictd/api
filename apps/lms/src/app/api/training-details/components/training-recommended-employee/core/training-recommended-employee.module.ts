import { CrudModule } from '@gscwd-api/crud';
import { TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingRecommendedEmployeeService } from './training-recommended-employee.service';
import { TrainingRecommendedEmployeeController } from './training-recommended-employee.controller';

@Module({
  imports: [CrudModule.register(TrainingRecommendedEmployee)],
  controllers: [TrainingRecommendedEmployeeController],
  providers: [TrainingRecommendedEmployeeService],
  exports: [TrainingRecommendedEmployeeService],
})
export class TrainingRecommendedEmployeeModule {}
