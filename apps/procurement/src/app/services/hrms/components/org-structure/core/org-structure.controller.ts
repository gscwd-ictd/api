import { Controller, Get, Param } from '@nestjs/common';
import { OrgStructureService } from './org-structure.service';

@Controller({ version: '1', path: 'org' })
export class OrgStructureController {
  constructor(private readonly orgStructService: OrgStructureService) {}

  @Get()
  async getAllOrgUnits() {
    return await this.orgStructService.getAllOrgUnits();
  }

  @Get(':id')
  async getOrgEntityById(@Param('id') id: string) {
    return await this.orgStructService.getOrgUnitById(id);
  }
}
