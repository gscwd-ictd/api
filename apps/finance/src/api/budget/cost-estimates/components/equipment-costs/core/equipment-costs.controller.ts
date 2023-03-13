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
  InternalServerErrorException,
} from '@nestjs/common';
import { EquipmentCostService } from './equipment-costs.service';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateEquipmentCostDto, EquipmentCost, UpdateEquipmentCostDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'budget/equipment-costs' })
export class EquipmentCostController implements ICrudRoutes {
  constructor(private readonly equipmentCostService: EquipmentCostService) {}

  @Post()
  async create(@Body() data: CreateEquipmentCostDto): Promise<EquipmentCost> {
    return await this.equipmentCostService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<EquipmentCost> | EquipmentCost[]> {
    return await this.equipmentCostService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EquipmentCost> {
    return await this.equipmentCostService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEquipmentCostDto): Promise<UpdateResult> {
    return await this.equipmentCostService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.equipmentCostService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
