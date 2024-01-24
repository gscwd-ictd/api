import { Controller } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { PdcChairmanDto, PdcSecretaryDto } from '@gscwd-api/models';

@Controller()
export class TrainingApprovalsMicroserviceController {
  constructor(private readonly trainingApprovalsServices: TrainingApprovalsService) {}

  //pdc secretariate approval
  @MessagePattern(TrainingPatterns.PDC_SECRETARIATE_APPROVAL)
  async pdcSecretaryApproval(@Payload() data: PdcSecretaryDto) {
    try {
      return await this.trainingApprovalsServices.pdcSecretaryApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_APPROVAL)
  async pdcChairmanApproval(@Payload() data: PdcChairmanDto) {
    try {
      return await this.trainingApprovalsServices.pdcChairmanApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
