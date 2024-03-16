import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDistributionsService } from '../components/slot-distributions';
import { TrainingRecommendedEmployeeService } from '../components/recommended-employees';

@Controller()
export class TrainingDetailsMicroserviceController {
  constructor(
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService
  ) {}

  /* find all training distribution by supervisor id */
  @MessagePattern(TrainingPatterns.FIND_TRAINING_DISTRIBUTION_BY_SUPERVISOR_ID)
  async findAllDistributionBySupervisorId(@Payload() supervisorId: string) {
    try {
      return await this.trainingDistributionsService.findAllDistributionBySupervisorId(supervisorId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all recommended employees by distribution id */
  @MessagePattern(TrainingPatterns.FIND_TRAINING_RECOMMENDED_EMPLOYEES_BY_DISTRIBUTION_ID)
  async findAllRecommendedEmployeesByDistributionId(@Payload() distributionId: string) {
    try {
      return await this.trainingRecommendedEmployeesService.findAllRecommendedEmployeesByDistributionId(distributionId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* testing microservices */

  /* find all training distribution by supervisor id */
  @Get('training/distribution/supervisor/:id')
  async findAllTrainingDistributionSupervisorId(@Param('id') supervisorId: string) {
    return await this.trainingDistributionsService.findAllDistributionBySupervisorId(supervisorId);
  }

  @Get('training/distribution/:id/recommended/employees')
  async findAllByDistributionId(@Param('id') distributionId: string) {
    return await this.trainingRecommendedEmployeesService.findAllRecommendedEmployeesByDistributionId(distributionId);
  }
}
