import { Controller, Get, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAllEmployees() {
    return await this.employeeService.getProvider().findAll({});
  }

  @MessagePattern({ msg: 'find_employee_by_id' })
  async findEmployeeById(@Payload('id', ParseUUIDPipe) employeeId: string) {
    return await this.employeeService
      .getProvider()
      .findOneBy({ employeeId }, (error) => new RpcException({ message: 'Cannot find employee', details: error }));
  }
}
