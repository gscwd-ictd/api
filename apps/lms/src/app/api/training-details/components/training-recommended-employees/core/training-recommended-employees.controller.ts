import { Controller } from '@nestjs/common';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';

@Controller({ version: '1', path: 'training-recommended-employees' })
export class TrainingRecommendedEmployeesController {
  constructor(private readonly trainingRecommendedEmployeeService: TrainingRecommendedEmployeeService) {}
}
