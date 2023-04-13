import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateCostEstimateDto } from '../data/cost-estimates.dto';
import { CostEstimateService } from './cost-estimates.service';
import { FindAllProjectsInterceptor } from '../misc/interceptors/find-all-projects.interceptor';

@Controller({ version: '1', path: 'cost-estimates' })
export class CostEstimateController {
  constructor(private readonly costEstimateService: CostEstimateService) {}

  @Post()
  async create(@Body() costEstimateDto: CreateCostEstimateDto) {
    return await this.costEstimateService.createCostEstimate(costEstimateDto);
  }

  @UseInterceptors(FindAllProjectsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.costEstimateService.findAll({ page, limit });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.costEstimateService.findById(id);
  }
}
