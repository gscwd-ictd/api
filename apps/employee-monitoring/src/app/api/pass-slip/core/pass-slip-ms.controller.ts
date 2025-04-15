import { Controller } from '@nestjs/common';
import { PassSlipService } from './pass-slip.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class PassSlipControllerMs {
  constructor(private readonly passSlipService: PassSlipService) {}

  @MessagePattern('get_number_of_used_pass_slips')
  async getNumberOfUsedPassSlips(@Payload() employeeId: string) {
    try {
      return await this.passSlipService.getUsedPassSlipsCountByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('get_assignable_supervisors_for_pass_slip')
  async getAssignableSupervisorForPassSlip(@Payload() employeeData: { employeeId: string; orgId: string }) {
    try {
      const result = await this.passSlipService.getAssignableSupervisorForPassSlip(employeeData);
      console.log(result);
      return result;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
