import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DtrCorrectionService } from './dtr-correction.service';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller()
export class DtrCorrectionMsController {
  constructor(private readonly dtrCorrectionService: DtrCorrectionService) { }
  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_pending_dtr_corrections_for_approval')
  async getPendingDtrCorrectionsCount(@Payload() employeeId: string) {
    try {
      return await this.dtrCorrectionService.getPendingDtrCorrections(employeeId);
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }
}
