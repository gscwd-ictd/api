import { Controller, Get, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller({ version: '1', path: 'employees' })
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('q')
  async findEmployeesByName(@Query('name') name: string) {
    return await this.employeesService.findEmployeesByName(name);
  }
}
