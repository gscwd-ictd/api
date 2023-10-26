import { Controller, Get, Param, Query } from '@nestjs/common';
import { HrmsEmployeesService } from './employees.service';

@Controller({ version: '1', path: 'hrms/employees' })
export class HrmsEmployeesController {
  constructor(private readonly hrmsEmployeesService: HrmsEmployeesService) {}

  @Get('q')
  async findEmployeesByName(@Query('name') name: string) {
    return await this.hrmsEmployeesService.findEmployeesByName(name);
  }

  @Get(':id')
  async findEmployeesById(@Param('id') id: string) {
    return await this.hrmsEmployeesService.findEmployeesById(id);
  }
}
