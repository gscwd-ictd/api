import { Controller } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { PdcChairmanDto, PdcSecretaryDto } from '@gscwd-api/models';

@Controller()
export class TrainingApprovalsMicroserviceController {
  constructor(private readonly trainingApprovalsServices: TrainingApprovalsService) {}

  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_SECRETARY_APPROVAL)
  async findAllpdcSecretaryApproval() {
    try {
      return await this.trainingApprovalsServices.findAllpdcSecretaryApproval();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //pdc secretariate approval
  @MessagePattern(TrainingPatterns.PDC_SECRETARY_APPROVAL)
  async pdcSecretaryApproval(@Payload() data: PdcSecretaryDto) {
    try {
      return await this.trainingApprovalsServices.pdcSecretaryApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern(TrainingPatterns.FIND_ALL_PDC_CHAIRMAL_APPROVAL)
  async findAllpdcChairmanApproval() {
    try {
      return await this.trainingApprovalsServices.findAllpdcChairmanApproval();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //pdc chairman approval
  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_APPROVAL)
  async pdcChairmanApproval(@Payload() data: PdcChairmanDto) {
    try {
      return await this.trainingApprovalsServices.pdcChairmanApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
