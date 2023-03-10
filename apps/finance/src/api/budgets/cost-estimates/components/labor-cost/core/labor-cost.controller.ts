import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { CreateLaborCostDto, UpdateLaborCostDto } from '../data/labor-cost.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { LaborCost } from '../data/labor-cost.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'budget/labor-costs' })
export class LaborCostController implements ICrudRoutes {
  constructor(private readonly laborCostService: LaborCostService) {}

  @Post()
  async create(@Body() data: CreateLaborCostDto): Promise<LaborCost> {
    return await this.laborCostService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LaborCost> | LaborCost[]> {
    return await this.laborCostService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<LaborCost> {
    return await this.laborCostService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborCostDto): Promise<UpdateResult> {
    return await this.laborCostService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.laborCostService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
