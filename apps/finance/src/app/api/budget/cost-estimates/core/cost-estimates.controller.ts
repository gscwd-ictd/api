import { Body, Controller, Post } from '@nestjs/common';
import { CreateCostEstimateDto } from '../data/cost-estimates.dto';
import { CostEstimateService } from './cost-estimates.service';

@Controller({ version: '1', path: 'cost-estimates' })
export class CostEstimateController {
  constructor(private readonly costEstimateService: CostEstimateService) {}

  @Post()
  async create(@Body() costEstimateDto: CreateCostEstimateDto) {
    return await this.costEstimateService.createCostEstimate(costEstimateDto);
  }
}
