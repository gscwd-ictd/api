import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';
import { NomineeRaw, TrainingNomineeRaw } from '@gscwd-api/utils';

@Controller()
export class TrainingNomineesMicroserviceController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  // add training nominee by training distribution id
  @MessagePattern(TrainingPatterns.ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID)
  async create(@Payload() data: CreateTrainingNomineeDto) {
    try {
      return await this.trainingNomineesService.createNominees(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // find all nominees (type = nominee or stand-in) by distribution id
  @MessagePattern(TrainingPatterns.FIND_TRAINING_NOMINEES_BY_DISTRIBUTION_ID)
  async findAllNomineesByDistributionId(@Payload() data: TrainingNomineeRaw) {
    try {
      const { distributionId, nomineeType } = data;
      return await this.trainingNomineesService.findAllNomineesByDistributionId(distributionId, nomineeType);
    } catch (error) {
      Logger.log(error);
      throw new RpcException(error);
    }
  }

  // find all training by employee id
  @MessagePattern(TrainingPatterns.FIND_ALL_TRAINING_BY_EMPLOYEE_ID)
  async findAllTrainingByEmployeeId(@Payload() data: NomineeRaw) {
    try {
      const { employeeId, status } = data;
      return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId, status);
    } catch (error) {
      Logger.log(error);
      throw new RpcException(error);
    }
  }

  // nominated employee update nominee status by nominee id
  @MessagePattern(TrainingPatterns.UPDATE_TRAINING_NOMINEES_STATUS_BY_ID)
  async updateTrainingNomineeStatus(@Payload() data: UpdateTrainingNomineeStatusDto) {
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
