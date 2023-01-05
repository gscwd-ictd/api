import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { MaterialCostService } from './material-cost.service';
import { CreateMaterialCostDto, UpdateMaterialCostDto } from '../data/material-cost.dto';

@Controller('cost_estimates/material_costs')
export class MaterialCostController implements ICrudRoutes {
  constructor(private readonly materialCostService: MaterialCostService) {}

  @Post()
  async create(@Body() itemDto: CreateMaterialCostDto) {
    return await this.materialCostService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.materialCostService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.materialCostService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialCostDto) {
    return await this.materialCostService.update({ id }, dto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.materialCostService.delete({ id }, () => new BadRequestException());
  }
}
