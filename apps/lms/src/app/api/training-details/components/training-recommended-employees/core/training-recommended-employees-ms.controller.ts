import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';

@Controller()
export class TrainingRecommendedEmployeesMicroserviceController {
  constructor(private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService) {}

  @MessagePattern(TrainingPatterns.FIND_TRAINING_RECOMMENDED_EMPLOYEES_BY_DISTRIBUTION_ID)
  async findAllByDistributionId(@Payload() supervisorId: string) {
    try {
      return await this.trainingRecommendedEmployeesService.findAllByDistributionId(supervisorId);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
