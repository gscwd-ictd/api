import { CreateMaterialCostDto, MaterialCost, UpdateMaterialCostDto } from '@gscwd-api/models';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { MaterialCostService } from './material-costs.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController {
  constructor(private readonly materialCostService: MaterialCostService) {}

  @Post()
  async create(@Body() data: CreateMaterialCostDto): Promise<MaterialCost> {
    return await this.materialCostService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<MaterialCost> | MaterialCost[]> {
    return await this.materialCostService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MaterialCost> {
    return await this.materialCostService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMaterialCostDto): Promise<UpdateResult> {
    return await this.materialCostService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.materialCostService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
