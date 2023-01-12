import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EquipmentCostService } from './equipment-cost.service';
import { CreateEquipmentCostDto, UpdateEquipmentCostDto } from '../data/equipment-cost.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EquipmentCost } from '../data/equipment-cost.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'cost-estimates/equipment-costs' })
export class EquipmentCostController implements ICrudRoutes {
  constructor(private readonly equipmentCostService: EquipmentCostService) {}

  @Post()
  async create(@Body() data: CreateEquipmentCostDto): Promise<EquipmentCost> {
    return await this.equipmentCostService.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<EquipmentCost> | EquipmentCost[]> {
    return await this.equipmentCostService.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EquipmentCost> {
    return await this.equipmentCostService.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEquipmentCostDto): Promise<UpdateResult> {
    return await this.equipmentCostService.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.equipmentCostService.crud().delete({ id }, () => new BadRequestException());
  }
}
