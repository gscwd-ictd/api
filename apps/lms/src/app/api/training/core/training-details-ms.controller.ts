import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingDistributionsService } from '../components/slot-distributions';
import { TrainingRecommendedEmployeeService } from '../components/recommended-employees';
import { TrainingNomineesService } from '../components/nominees';
import { CreateTrainingNomineeDto, GeneralManagerDto, PdcChairmanDto, PdcSecretariatDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';
import { TrainingNomineeRaw, TrainingStatus } from '@gscwd-api/utils';
import { TrainingApprovalsService } from '../components/approvals';
import { TrainingDetailsService } from './training-details.service';

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
      throw new RpcException(error);
    }
  }

  /* find all training details by employee id */
  @MessagePattern(TrainingPatterns.FIND_ALL_TRAINING_BY_EMPLOYEE_ID)
  async findAllTrainingByEmployeeId(@Payload() employeeId: string) {
    try {
      return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* edit nominee status by nominee id */
  @MessagePattern(TrainingPatterns.UPDATE_TRAINING_NOMINEES_STATUS_BY_ID)
  async updateTrainingNomineeStatus(@Payload() data: UpdateTrainingNomineeStatusDto) {
    return await this.trainingNomineesService.updateTrainingNomineeStatus(data);
  }

  /* find all training to be approved by the pdc secretariat */
  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_SECRETARIAT_APPROVAL)
  async findAllTrainingForPdcSecretariatApproval() {
    try {
      const status = TrainingStatus.PDC_SECRETARIAT_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(status);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* pdc secretariat approved a training by training id */
  @MessagePattern(TrainingPatterns.PDC_SECRETARIAT_APPROVAL)
  async pdcSecretariatApproved(@Payload() data: PdcSecretariatDto) {
    try {
      const trainingStatus = TrainingStatus.PDC_CHAIRMAN_APPROVAL;
      return await this.trainingDetailsService.pdcSecretariatApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* pdc secretariat declined a training by training id */
  @MessagePattern(TrainingPatterns.PDC_SECRETARIAT_DECLINED)
  async pdcSecretariatDeclined(@Payload() data: PdcSecretariatDto) {
    try {
      const trainingStatus = TrainingStatus.PDC_SECRETARIAT_DECLINED;
      return await this.trainingDetailsService.pdcSecretariatApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all training to be approved by the pdc chairman */
  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_CHAIRMAN_APPROVAL)
  async findAllTrainingForPdcChairmanApproval() {
    try {
      const trainingStatus = TrainingStatus.PDC_CHAIRMAN_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* pdc chairman approved a training by training id */
  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_APPROVAL)
  async pdcChairmanApproved(@Payload() data: PdcChairmanDto) {
    try {
      const trainingStatus = TrainingStatus.GM_APPROVAL;
      return await this.trainingDetailsService.pdcChairmanApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* pdc chairman declined a training by training id */
  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_DECLINED)
  async pdcChairmanDeclined(@Payload() data: PdcChairmanDto) {
    try {
      const trainingStatus = TrainingStatus.PDC_CHAIRMAN_DECLINED;
      return await this.trainingDetailsService.pdcChairmanApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* find all training to be approved by the general manager */
  @MessagePattern(TrainingPatterns.FIND_ALL_GM_APPROVAL)
  async findAllTrainingForGmApproval() {
    try {
      const trainingStatus = TrainingStatus.GM_APPROVAL;
      return await this.trainingApprovalsService.findAllApprovalByPdcStatus(trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* general manager approved a training by training id */
  @MessagePattern(TrainingPatterns.GM_APPROVAL)
  async generalManagerApproved(@Payload() data: GeneralManagerDto) {
    try {
      const trainingStatus = TrainingStatus.FOR_BATCHING;
      return await this.trainingDetailsService.generalManagerApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* general manager declined a training by training id */
  @MessagePattern(TrainingPatterns.GM_DECLINED)
  async generalManagerDeclined(@Payload() data: GeneralManagerDto) {
    try {
      const trainingStatus = TrainingStatus.GM_DECLINED;
      return await this.trainingDetailsService.generalManagerApproval(data, trainingStatus);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* count pending nomination by supervisor id */
  @MessagePattern(TrainingPatterns.COUNT_PENDING_NOMINATION_BY_SUPERVISOR_ID)
  async countPendingNominationBySupervisorId(@Payload() supervisorId: string) {
    try {
      return await this.trainingDistributionsService.countPendingNominationBySupervisorId(supervisorId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /* testing microservices */

  /* find all training distribution by supervisor id */
  @Get('training/distributions/supervisor/:id')
  async findAllTrainingDistributionSupervisorId(@Param('id') supervisorId: string) {
    return await this.trainingDistributionsService.findAllDistributionBySupervisorId(supervisorId);
  }

  /* find all recommended employees by distribution id */
  @Get('training/distributions/:id/recommended')
  async findAllTrainingRecommendedEmployeesByDistributionId(@Param('id') distributionId: string) {
    return await this.trainingRecommendedEmployeesService.findAllRecommendedEmployeesByDistributionId(distributionId);
  }

  /* insert training nominees by training distribution id */
  @Post('training/distributions/nominees')
  async createTrainingNominees(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.createNominees(data);
  }

  /* find all training nominees by distribution id */
  @Get('training/distributions/:id/nominees')
  async findAllTrainingNomineesByDistributionId(@Param('id') distributionId: string) {
    const nomineeType = null;
    return await this.trainingNomineesService.findAllNomineesByDistributionId(distributionId, nomineeType);
  }

  /* find all training details assigned to employees by employee id. */
  @Get('training/employees/:id')
  async findAllTrainingDetailsByEmployeeId(@Param('id') employeeId: string) {
    return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId);
  }

  /* edit nominee status by nominee id */
  @Patch('training/employees')
  async updateNomineeStatus(@Body() data: UpdateTrainingNomineeStatusDto) {
    return await this.trainingNomineesService.updateTrainingNomineeStatus(data);
  }

  /* find all training to be approved by the pdc secretariat */
  @Get('training/approvals/secretariat')
  async findAllTrainingSecretariatApproval() {
    const trainingStatus = TrainingStatus.PDC_SECRETARIAT_APPROVAL;
    return await this.trainingApprovalsService.findAllApprovalByPdcStatus(trainingStatus);
  }

  /* pdc secretariat approved a training by training id */
  @Patch('training/approvals/secretariat/approved')
  async approvedTrainingBySecretariat(@Body() data: PdcSecretariatDto) {
    const trainingStatus = TrainingStatus.PDC_CHAIRMAN_APPROVAL;
    return await this.trainingDetailsService.pdcSecretariatApproval(data, trainingStatus);
  }

  /* pdc secretariat declined a training by training id */
  @Patch('training/approvals/secretariat/declined')
  async declinedTrainingBySecretariat(@Body() data: PdcSecretariatDto) {
    const trainingStatus = TrainingStatus.PDC_SECRETARIAT_DECLINED;
    return await this.trainingDetailsService.pdcSecretariatApproval(data, trainingStatus);
  }

  /* find all training to be approved by the pdc chairman */
  @Get('training/approvals/chairman')
  async findAllTrainingChairmanApproval() {
    const trainingStatus = TrainingStatus.PDC_CHAIRMAN_APPROVAL;
    return await this.trainingApprovalsService.findAllApprovalByPdcStatus(trainingStatus);
  }

  /* pdc chairman approved a training by training id */
  @Patch('training/approvals/chairman/approved')
  async approvedTrainingByChairman(@Body() data: PdcChairmanDto) {
    const trainingStatus = TrainingStatus.GM_APPROVAL;
    return await this.trainingDetailsService.pdcChairmanApproval(data, trainingStatus);
  }

  /* pdc chairman declined a training by training id */
  @Patch('training/approvals/chairman/declined')
  async declinedTrainingByChairman(@Body() data: PdcChairmanDto) {
    const trainingStatus = TrainingStatus.PDC_CHAIRMAN_DECLINED;
    return await this.trainingDetailsService.pdcChairmanApproval(data, trainingStatus);
  }

  /* find all training to be approved by the general manager */
  @Get('training/approvals/gm')
  async findAllTrainingGeneralManagernApproval() {
    const trainingStatus = TrainingStatus.GM_APPROVAL;
    return await this.trainingApprovalsService.findAllApprovalByPdcStatus(trainingStatus);
  }

  /* general manager approved a training by training id */
  @Patch('training/approvals/gm/approved')
  async approvedTrainingByGm(@Body() data: GeneralManagerDto) {
    const trainingStatus = TrainingStatus.FOR_BATCHING;
    return await this.trainingDetailsService.generalManagerApproval(data, trainingStatus);
  }

  /* general manager declined a training by training id */
  @Patch('training/approvals/gm/declined')
  async declinedTrainingByGm(@Body() data: GeneralManagerDto) {
    const trainingStatus = TrainingStatus.GM_DECLINED;
    return await this.trainingDetailsService.generalManagerApproval(data, trainingStatus);
  }

  /* count pending nomination by supervisor id */
  @Get('count/nomination/supervisor/:supevisorId')
  async pendingNominationBySupervisorId(@Param('supervisorId') supervisorId: string) {
    return await this.trainingDistributionsService.countPendingNominationBySupervisorId(supervisorId);
  }
}
