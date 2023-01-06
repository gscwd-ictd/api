import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UnitsView } from '../data/units-view';

@Controller({ version: '1', path: 'inquiry/units' })
export class UnitController {
  constructor(private readonly datasource: DataSource) {}

  @Get('views/')
  async getAllUnits() {
    return await this.datasource.getRepository(UnitsView).createQueryBuilder().getMany();
  }
}
