import { CostEstimatePatterns } from '@gscwd-api/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CostEstimateService } from './cost-estimates.service';
import { FindAllProjectsInterceptor } from '../misc/interceptors/find-all-projects.interceptor';

@Controller()
export class CostEstimateMicroserviceController {
  constructor(private readonly costEstimateService: CostEstimateService) {}

  @UseInterceptors(FindAllProjectsInterceptor)
  @MessagePattern(CostEstimatePatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.costEstimateService.findAll({ page, limit });
  }

  @MessagePattern(CostEstimatePatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.costEstimateService.findById(id);
  }
}
