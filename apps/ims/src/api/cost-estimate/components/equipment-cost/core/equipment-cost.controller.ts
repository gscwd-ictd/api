import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { EquipmentCostService } from './equipment-cost.service';
import { CreateEquipmentCostDto, UpdateEquipmentCostDto } from '../data/equipment-cost.dto';
import { ICrudRoutes } from '@gscwd-api/crud';

@Controller({ version: '1', path: 'cost-estimates/equipment-costs' })
export class EquipmentCostController implements ICrudRoutes {
  constructor(private readonly equipmentCostService: EquipmentCostService) {}

  @Post()
  async create(@Body() data: CreateEquipmentCostDto) {
    return await this.equipmentCostService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.equipmentCostService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.equipmentCostService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEquipmentCostDto) {
    return await this.equipmentCostService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.equipmentCostService.delete({ id }, () => new BadRequestException());
  }
}
