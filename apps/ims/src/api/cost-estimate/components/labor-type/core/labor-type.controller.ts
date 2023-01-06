import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, NotFoundException } from '@nestjs/common';
import { LaborTypeService } from './labor-type.service';
import { CreateLaborTypeDto, UpdateLaborTypeDto } from '../data/labor-type.dto';
import { ICrudRoutes } from '@gscwd-api/crud';

@Controller({ version: '1', path: 'labor-types' })
export class LaborTypeController implements ICrudRoutes {
  constructor(private readonly laborTypeService: LaborTypeService) {}

  @Post()
  async create(@Body() data: CreateLaborTypeDto) {
    return await this.laborTypeService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.laborTypeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.laborTypeService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborTypeDto) {
    return this.laborTypeService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.laborTypeService.delete({ id }, () => new BadRequestException());
  }
}
