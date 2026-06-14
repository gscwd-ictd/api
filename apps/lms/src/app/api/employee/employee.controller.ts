import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller({ version: '1', path: 'employee' })
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':employeeId')
  async findAllTrainingByEmployeeId(@Param('employeeId') employeeId: string) {
    try {
      return await this.employeeService.findTraininDetailsByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('find_all_employee_training_by_employee_id')
  async findAllTrainingByEmployeeIdMicro(@Payload() employeeId: string) {
    try {
      return await this.employeeService.findTraininDetailsByEmployeeId(employeeId);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
