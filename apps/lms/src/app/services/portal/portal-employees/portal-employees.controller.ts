import { Controller, Get, Param } from '@nestjs/common';
import { PortalEmployeesService } from './portal-employees.service';

@Controller({ version: '1', path: 'portal/employees' })
export class PortalEmployeesController {
  constructor(private readonly portalEmployeesService: PortalEmployeesService) {}

  @Get('/details/:id')
  async findEmployeesDetailsById(@Param('id') id: string) {
    return await this.portalEmployeesService.findEmployeesDetailsById(id);
  }
}
