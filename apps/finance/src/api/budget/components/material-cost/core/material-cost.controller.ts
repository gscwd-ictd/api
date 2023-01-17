import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController {
  constructor(private readonly service: MaterialCostService) {}

  @Get()
  async test(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.service.findAllItems({ page, limit });
  }

  @Get(':id')
  async testById(@Param('id') id: string) {
    return await this.service.findItemById(id);
  }
}
