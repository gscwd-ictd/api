import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CostEstimateService } from './cost-estimate.service';

@Controller({ version: '1', path: 'finance' })
export class CostEstimateController {
  constructor(private readonly costEstimateService: CostEstimateService) {}

  @Get('projects')
  async getAllProjects(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.costEstimateService.getAllProjects({ page, limit });
  }

  @Get('projects/:id')
  async getProjectDetailsById(@Param('id') id: string) {
    return await this.costEstimateService.getProjectDetailsById(id);
  }
}
