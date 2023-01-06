import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, NotFoundException } from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { CreateLaborCostDto, UpdateLaborCostDto } from '../data/labor-cost.dto';
import { ICrudRoutes } from '@gscwd-api/crud';

@Controller({ version: '1', path: 'cost-estimates/labor-costs' })
export class LaborCostController implements ICrudRoutes {
  constructor(private readonly laborCostService: LaborCostService) {}

  @Post()
  async create(@Body() data: CreateLaborCostDto) {
    return await this.laborCostService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.laborCostService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.laborCostService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborCostDto) {
    return await this.laborCostService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.laborCostService.delete({ id }, () => new BadRequestException());
  }
}
