import { Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController {
  constructor(private readonly materialCostService: MaterialCostService) {}

  @Get('specs')
  async findAllSpecs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    console.log('call specs from ims');
    return await this.materialCostService.findAll({ pagination: { page, limit } });
  }

  @Get('/masterial-cost')
  async findAll() {
    return await this.materialCostService.getProvider().findAll({ pagination: { page: 1, limit: 10 } });
  }
}
