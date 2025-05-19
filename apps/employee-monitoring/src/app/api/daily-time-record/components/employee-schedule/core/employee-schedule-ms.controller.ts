import { CreateEmployeeScheduleDto } from '@gscwd-api/models';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { EmployeeScheduleService } from './employee-schedule.service';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller('employee-schedule')
export class EmployeeScheduleMsController {
  constructor(private readonly employeeScheduleService: EmployeeScheduleService) {}

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('add_employee_schedule')
  async addEmployeeSchedule(@Payload() employeeScheduleDto: CreateEmployeeScheduleDto) {
    try {
      return await this.employeeScheduleService.addEmployeeSchedule(employeeScheduleDto);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_employee_schedule')
  async getEmployeeSchedule(@Payload() employeeId: string) {
    try {
      return await this.employeeScheduleService.getEmployeeSchedule(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
