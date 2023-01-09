import { ICrudRoutes } from '@gscwd-api/crud';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateMaterialCostDto, UpdateMaterialCostDto } from '../data/material-cost.dto';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'material-cost' })
export class MaterialCostController implements ICrudRoutes {
  constructor(private readonly materialcostService: MaterialCostService) {}

  @Post()
  async create(@Body() data: CreateMaterialCostDto) {
    return await this.materialcostService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.materialcostService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.materialcostService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMaterialCostDto) {
    return this.materialcostService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.materialcostService.delete({ id }, () => new BadRequestException());
  }
}
