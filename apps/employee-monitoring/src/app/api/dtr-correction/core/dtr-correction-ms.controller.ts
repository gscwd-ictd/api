import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DtrCorrectionService } from './dtr-correction.service';

@Controller()
export class DtrCorrectionMsController {
  constructor(private readonly dtrCorrectionService: DtrCorrectionService) {}
  @MessagePattern('get_pending_dtr_corrections_for_approval')
  async getPendingDtrCorrectionsCount(@Payload() employeeId: string) {
    return await this.dtrCorrectionService.getPendingDtrCorrections(employeeId);
  }
}
