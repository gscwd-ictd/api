import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeTagsService } from './employee-tags.service';
import { CreateEmployeeTags } from '@gscwd-api/models';

@Controller({ version: '1', path: 'employee-tags' })
export class EmployeeTagsController {
  constructor(private readonly employeeTagsService: EmployeeTagsService) {}

  @Post()
  async create(@Body() data: CreateEmployeeTags) {
    return await this.employeeTagsService.addEmployeeTags(data);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.employeeTagsService.findTagsByEmployeeId(id);
  }

  @Get('tag/:id')
  async findEmployeesByTagId(@Param('id') tagId: string) {
    return await this.employeeTagsService.findEmployeesByTagId(tagId);
  }
}
