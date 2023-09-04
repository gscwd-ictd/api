import { Controller } from '@nestjs/common';
import { TrainingRecommendedEmployeeService } from './training-recommended-employee.service';

@Controller({ version: '1', path: 'training-recommended-employees' })
export class TrainingRecommendedEmployeeController {
  constructor(private readonly trainingRecommendedEmployeeService: TrainingRecommendedEmployeeService) {}
}
