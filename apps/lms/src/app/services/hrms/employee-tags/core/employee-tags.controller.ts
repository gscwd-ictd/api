import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HrmsEmployeeTagsService } from './employee-tags.service';
import { CreateEmployeeTagDto, DeleteEmployeeTagDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'hrms/employee-tags' })
export class HrmsEmployeeTagsController {
  constructor(private readonly hrmsEmployeeTagsService: HrmsEmployeeTagsService) {}

  @Post()
  async create(@Body() data: CreateEmployeeTagDto) {
    return await this.hrmsEmployeeTagsService.addEmployeeTags(data);
  }

  @Get('employee/:id')
  async findTagsByEmployeeId(@Param('id') id: string) {
    return await this.hrmsEmployeeTagsService.findTagsByEmployeeId(id);
  }

  @Get('tag/:id')
  async findEmployeesByTagId(@Param('id') id: string) {
    return await this.hrmsEmployeeTagsService.findEmployeesByTagId(id);
  }

  @Post('tag')
  async findEmployeesByMultipleTagId(@Body() tags: Array<string>) {
    return await this.hrmsEmployeeTagsService.findEmployeesByMultipleTagId(tags);
  }

  @Delete()
  async DeleteEmployeeTagDto(@Body() dto: DeleteEmployeeTagDto) {
    return await this.hrmsEmployeeTagsService.deleteEmployeeTags(dto);
  }
}
