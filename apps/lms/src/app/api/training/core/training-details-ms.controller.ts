import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDistributionsService } from '../components/slot-distributions';
import { TrainingRecommendedEmployeeService } from '../components/recommended-employees';
import { TrainingNomineesService } from '../components/nominees';
import { CreateTrainingNomineeDto } from '@gscwd-api/models';
import { TrainingNomineeRaw, TrainingStatus } from '@gscwd-api/utils';
import { TrainingApprovalsService } from '../components/approvals';

@Controller()
export class TrainingDetailsMicroserviceController {
  constructor(
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly trainingApprovalsService: TrainingApprovalsService
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

  /* insert training nominees by training distribution id */
  @MessagePattern(TrainingPatterns.ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID)
  async createNominees(@Payload() data: CreateTrainingNomineeDto) {
    try {
      return await this.trainingNomineesService.createNominees(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all training nominees (type = nominee or stand-in) by distribution id */
  @MessagePattern(TrainingPatterns.FIND_TRAINING_NOMINEES_BY_DISTRIBUTION_ID)
  async findAllNomineesByDistributionId(@Payload() data: TrainingNomineeRaw) {
    try {
      const { distributionId, nomineeType } = data;
      return await this.trainingNomineesService.findAllNomineesByDistributionId(distributionId, nomineeType);
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  /* find all training to be approved by the pdc secretary */
  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_SECRETARY_APPROVAL)
  async findAllTrainingForPdcSecretaryApproval() {
    try {
      const status = TrainingStatus.PDC_SECRETARY_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(status);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all training to be approved by the pdc chairman */
  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_CHAIRMAN_APPROVAL)
  async findAllTrainingForPdcChairmanApproval() {
    try {
      const status = TrainingStatus.PDC_CHAIRMAN_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(status);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all training to be approved by the general manager */
  @MessagePattern(TrainingPatterns.FIND_ALL_GM_APPROVAL)
  async findAllTrainingForGmApproval() {
    try {
      const status = TrainingStatus.GM_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(status);
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

  /* find all recommended employees by distribution id */
  @Get('training/distribution/:id/recommended')
  async findAllTrainingRecommendedEmployeesByDistributionId(@Param('id') distributionId: string) {
    return await this.trainingRecommendedEmployeesService.findAllRecommendedEmployeesByDistributionId(distributionId);
  }

  /* insert training nominees by training distribution id */
  @Post('training/nominees')
  async createTrainingNominees(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.createNominees(data);
  }

  /* find all training nominees (type = nominee or stand-in) by distribution id */
  @Get('training/distribution/:id/nominees')
  async findAllTrainingNomineesByDistributionId(@Param('id') distributionId: string) {
    const nomineeType = null;
    return await this.trainingNomineesService.findAllNomineesByDistributionId(distributionId, nomineeType);
  }
}
