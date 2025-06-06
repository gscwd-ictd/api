import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OvertimeService } from './overtime.service';
import { MsExceptionFilter } from '@gscwd-api/utils';
import { UpdateOvertimeApplicationDto } from '@gscwd-api/models';

@Controller('overtime')
export class OvertimeMSController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_overtime_immediate_supervisor')
  async getOvertimeImmediateSupervisorByEmployeeId(@Payload() employeeId: string) {
    try {
      return await this.overtimeService.getOvertimeImmediateSupervisorByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_overtime_approvals_count')
  async getOvertimeApprovalsCount(@Payload() managerId: string) {
    try {
      return await this.overtimeService.getOvertimeApplicationsForManagerApprovalCount(managerId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('update_overtime_details')
  async updateOvertimeDetails(@Payload() updateOvertimeApplicationDto: UpdateOvertimeApplicationDto) {
    try {
      return await this.overtimeService.updateOvertimeDetails(updateOvertimeApplicationDto);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }
}
