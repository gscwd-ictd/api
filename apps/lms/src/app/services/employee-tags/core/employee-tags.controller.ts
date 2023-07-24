import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EmployeeTagsService } from './employee-tags.service';
import { CreateEmployeeTagDto, DeleteEmployeeTagDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'employee-tags' })
export class EmployeeTagsController {
  constructor(private readonly employeeTagsService: EmployeeTagsService) {}

  @Post()
  async create(@Body() data: CreateEmployeeTagDto) {
    return await this.employeeTagsService.addEmployeeTags(data);
  }

  @Get(':id')
  async findTagsByEmployeeId(@Param('id') id: string) {
    return await this.employeeTagsService.findTagsByEmployeeId(id);
  }

  @Get('tag/:id')
  async findEmployeesByTagId(@Param('id') id: string) {
    return await this.employeeTagsService.findEmployeesByTagId(id);
  }

  @Delete()
  async DeleteEmployeeTagDto(@Body() dto: DeleteEmployeeTagDto) {
    return await this.employeeTagsService.deleteEmployeeTags(dto);
  }
}
