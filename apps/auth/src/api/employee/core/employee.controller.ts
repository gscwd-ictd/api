import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAllEmployees() {
    return await this.employeeService.findAll();
  }

  @Get(':id')
  async findEmployeeById(@Param('id') employeeId: string) {
    return await this.employeeService.findOneBy({ employeeId }, () => new NotFoundException());
  }
}
