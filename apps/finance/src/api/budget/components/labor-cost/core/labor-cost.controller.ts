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
    return await this.laborCostService.getProvider().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LaborCost>> {
    return await this.laborCostService.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<LaborCost> {
    return await this.laborCostService.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborCostDto): Promise<UpdateResult> {
    return await this.laborCostService.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.laborCostService.getProvider().delete({ id }, () => new BadRequestException());
  }
}
