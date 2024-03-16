import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingDistributionsService } from './training-distributions.service';

@Controller()
export class TrainingDistributionsMicroserviceController {
  constructor(private readonly trainingDistributionsService: TrainingDistributionsService) {}

  @MessagePattern(TrainingPatterns.FIND_TRAINING_DISTRIBUTION_BY_SUPERVISOR_ID)
  async findTrainingDistributionSupervisorId(@Payload() supervisorId: string) {
    try {
      return await this.trainingDistributionsService.findTrainingDistributionSupervisorId(supervisorId);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
