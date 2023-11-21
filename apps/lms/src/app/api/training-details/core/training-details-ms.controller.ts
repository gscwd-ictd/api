import { Controller } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';

@Controller()
export class TrainingDetailsMicroserviceController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  // @MessagePattern(TrainingPatterns.FIND_TRAINING_RECOMMENDED_EMPLOYEE_BY_SUPERVISOR_ID)
  // async findTrainingRecommendedEmployeeBySupervisorId(@Payload() supervisorId: string) {
  //   return await this.trainingDetailsService.findTrainingRecommendedEmployeeBySupervisorId(supervisorId);
  // }
}
