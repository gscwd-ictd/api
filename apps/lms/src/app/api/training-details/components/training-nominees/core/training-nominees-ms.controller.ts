import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';

@Controller()
export class TrainingNomineesMicroserviceController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  // add training nominee by training distribution id
  @MessagePattern(TrainingPatterns.ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID)
  async create(@Payload() data: CreateTrainingNomineeDto) {
    try {
      return await this.trainingNomineesService.create(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern(TrainingPatterns.FIND_ALL_TRAINING_BY_EMPLOYEE_ID)
  async findAllTrainingByEmployeeId(@Payload() employeeId: string) {
    try {
      return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // nominated employee update nominee status by nominee id
  @MessagePattern(TrainingPatterns.UPDATE_TRAINING_NOMINEES_STATUS_BY_ID)
  async updateTrainingNomineeStatus(data: UpdateTrainingNomineeStatusDto) {
    const { id, ...rest } = data;
    return await this.trainingNomineesService.crud().update({
      updateBy: { id },
      dto: rest,
      onError: (error) => {
        Logger.log(error);
        throw new RpcException(error);
      },
    });
  }
}
