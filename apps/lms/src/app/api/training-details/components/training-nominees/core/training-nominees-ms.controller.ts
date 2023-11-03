import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto } from '@gscwd-api/models';

@Controller()
export class TrainingNomineesMicroserviceController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  @MessagePattern(TrainingPatterns.ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID)
  async findTrainingRecommendedEmployeeBySupervisorId(@Payload() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.create(data);
  }
}
