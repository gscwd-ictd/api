import { CrudService, FindAllOptions } from '@gscwd-api/crud';
import { Specifications } from '@gscwd-api/microservices';
import { RawItemSpecification } from '@gscwd-api/utils';
import { Controller, DefaultValuePipe, Get, HttpException, ParseIntPipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MaterialCost } from '../data/material-cost.entity';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController {
  constructor(private readonly materialCostService: MaterialCostService, private readonly crudService: CrudService<MaterialCost>) {}

  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    return (await this.crudService.findAll({ pagination: { page, limit } })) as Pagination<MaterialCost>;
  }

  @Get('specs')
  async findAllSpecs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.materialCostService.send<RawItemSpecification, FindAllOptions<RawItemSpecification>>({
      target: Specifications.FIND_ALL,
      payload: { pagination: { page, limit } },
      onError: (error) => new HttpException(error.message, error.code),
    });
  }
}
