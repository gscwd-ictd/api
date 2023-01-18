import { AuthPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, Get, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAllEmployees() {
    return await this.employeeService.crud().findAll({});
  }

  @MessagePattern(AuthPatterns.findById)
  async findEmployeeById(@Payload('id', ParseUUIDPipe) employeeId: string) {
    return await this.employeeService
      .crud()
      .findOneBy({ employeeId }, (error) => new MyRpcException({ message: 'Cannot find employee', code: 404, details: error }));
  }
}
