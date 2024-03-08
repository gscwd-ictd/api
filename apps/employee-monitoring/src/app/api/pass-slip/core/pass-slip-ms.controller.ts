import { Controller } from '@nestjs/common';
import { PassSlipService } from './pass-slip.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PassSlipControllerMs {
  constructor(private readonly passSlipService: PassSlipService) {}

  @MessagePattern('get_number_of_used_pass_slips')
  async getNumberOfUsedPassSlips(@Payload() employeeId: string) {
    return await this.passSlipService.getUsedPassSlipsCountByEmployeeId(employeeId);
  }
}
