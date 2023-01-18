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
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateMaterialCostDto, UpdateMaterialCostDto } from '../data/material-cost.dto';
import { MaterialCost } from '../data/material-cost.entity';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController implements ICrudRoutes {
  constructor(private readonly materialCostService: MaterialCostService) {}

  @Post()
  async create(@Body() data: CreateMaterialCostDto): Promise<MaterialCost> {
    return await this.materialCostService.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<MaterialCost> | MaterialCost[]> {
    return await this.materialCostService.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MaterialCost> {
    return await this.materialCostService.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMaterialCostDto): Promise<UpdateResult> {
    return await this.materialCostService.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.materialCostService.crud().delete({ id }, () => new BadRequestException());
  }
}
