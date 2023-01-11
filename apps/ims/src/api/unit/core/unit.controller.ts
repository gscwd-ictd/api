import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { UnitsView } from '../data/units-view';

@Controller({ version: '1', path: 'units' })
export class UnitController {
  constructor(private readonly datasource: DataSource) {}

  @Get('views/details')
  async getAllUnits(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<UnitsView>> {
    return await paginate(this.datasource.getRepository(UnitsView), { page, limit });
  }
}
