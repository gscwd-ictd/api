import { Controller } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { GeneralManagerDto, PdcChairmanDto, PdcSecretaryDto } from '@gscwd-api/models';

@Controller()
export class TrainingApprovalsMicroserviceController {
  constructor(private readonly trainingApprovalsServices: TrainingApprovalsService) {}

  // // pdc secretary approval
  // @MessagePattern(TrainingPatterns.PDC_SECRETARY_APPROVAL)
  // async pdcSecretaryApproval(@Payload() data: PdcSecretaryDto) {
  //   try {
  //     return await this.trainingApprovalsServices.pdcSecretaryApproval(data);
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  // // pdc secretary declined
  // @MessagePattern(TrainingPatterns.PDC_SECRETARY_DECLINED)
  // async pdcSecretaryDeclined(@Payload() data: PdcSecretaryDto) {
  //   try {
  //     return await this.trainingApprovalsServices.pdcSecretaryDeclined(data);
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  /*  // pdc chairman approval
  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_APPROVAL)
  async pdcChairmanApproval(@Payload() data: PdcChairmanDto) {
    try {
      return await this.trainingApprovalsServices.pdcChairmanApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  } */

  /* // pdc chairman declined
  @MessagePattern(TrainingPatterns.PDC_CHAIRMAN_DECLINED)
  async pdcChairmanDeclined(@Payload() data: PdcChairmanDto) {
    try {
      return await this.trainingApprovalsServices.pdcChairmanDeclined(data);
    } catch (error) {
      throw new RpcException(error);
    }
  } */

  /*  // pdc gm approval
  @MessagePattern(TrainingPatterns.GM_APPROVAL)
  async generalManagerApproval(@Payload() data: GeneralManagerDto) {
    try {
      return await this.trainingApprovalsServices.generalManagerApproval(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // pdc gm declined
  @MessagePattern(TrainingPatterns.GM_DECLINED)
  async generalManagerDeclined(@Payload() data: GeneralManagerDto) {
    try {
      return await this.trainingApprovalsServices.generalManagerDeclined(data);
    } catch (error) {
      throw new RpcException(error);
    }
  } */
}
