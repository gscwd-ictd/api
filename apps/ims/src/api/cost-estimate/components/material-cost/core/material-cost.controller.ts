import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateMaterialCostDto, UpdateMaterialCostDto } from '../data/material-cost.dto';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'material-cost' })
export class MaterialCostController implements ICrudRoutes {
  constructor(private readonly laborTypeService: MaterialCostService) {}

  @Post()
  async create(@Body() data: CreateMaterialCostDto) {
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
  async update(@Param('id') id: string, @Body() data: UpdateMaterialCostDto) {
    return this.laborTypeService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.laborTypeService.delete({ id }, () => new BadRequestException());
  }
}
