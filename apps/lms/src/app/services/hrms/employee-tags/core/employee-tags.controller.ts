import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HrmsEmployeeTagsService } from './employee-tags.service';
import { CreateEmployeeTagDto, DeleteEmployeeTagDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'hrms/employees' })
export class HrmsEmployeeTagsController {
  constructor(private readonly hrmsEmployeeTagsService: HrmsEmployeeTagsService) {}

  /* create multiple employee tags in a multiple employees */
  @Post('tags')
  async createEmployeeTags(@Body() data: CreateEmployeeTagDto) {
    return await this.hrmsEmployeeTagsService.createEmployeeTags(data);
  }

  /* find employee tags by employee id */
  @Get(':id/tags')
  async findTagsByEmployeeId(@Param('id') id: string) {
    return await this.hrmsEmployeeTagsService.findTagsByEmployeeId(id);
  }

  /* find employees by tag id */
  @Get('tags/:id')
  async findEmployeesByTagId(@Param('id') id: string) {
    return await this.hrmsEmployeeTagsService.findEmployeesByTagId(id);
  }

  /* find employees by multiple tag id */
  @Post('tags/q')
  async findEmployeesByMultipleTagId(@Body() tags: Array<string>) {
    return await this.hrmsEmployeeTagsService.findEmployeesByMultipleTagId(tags);
  }

  /* remove employee tags by employee id or tag id */
  @Delete('tags')
  async DeleteEmployeeTagDto(@Body() dto: DeleteEmployeeTagDto) {
    return await this.hrmsEmployeeTagsService.deleteEmployeeTags(dto);
  }
}
