import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OvertimeService } from './overtime.service';

@Controller('overtime')
export class OvertimeMSController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @MessagePattern('get_overtime_immediate_supervisor')
  async getOvertimeImmediateSupervisorByEmployeeId(@Payload() employeeId: string) {
    return await this.overtimeService.getOvertimeImmediateSupervisorByEmployeeId(employeeId);
  }
}
