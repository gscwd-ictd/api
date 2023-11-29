import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingDistributionsService } from './training-distributions.service';

@Controller()
export class TrainingDistributionsMicroserviceController {
  constructor(private readonly trainingDistributionsService: TrainingDistributionsService) {}

  @MessagePattern(TrainingPatterns.FIND_TRAINING_RECOMMENDED_EMPLOYEE_BY_SUPERVISOR_ID)
  async findTrainingRecommendedEmployeeBySupervisorId(@Payload() supervisorId: string) {
    return await this.trainingDistributionsService.findTrainingSupervisorId(supervisorId);
  }
}
