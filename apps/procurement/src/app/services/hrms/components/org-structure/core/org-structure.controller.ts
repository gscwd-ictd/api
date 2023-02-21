import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { OrgStructureService } from './org-structure.service';

@Controller({ version: '1', path: 'org' })
export class OrgStructureController {
  constructor(private readonly orgStructService: OrgStructureService) {}

  @Get()
  async getAllOrgByGroup(@Query('heirarchical', new DefaultValuePipe(false), ParseBoolPipe) heirarchical?: boolean) {
    return heirarchical ? await this.orgStructService.getAllOrgsByStructure() : await this.orgStructService.getAllOrgsByGroup();
  }

  @Get(':id')
  async getOrgEntityById(@Param('id') id: string) {
    return await this.orgStructService.getOrgUnitById(id);
  }
}
