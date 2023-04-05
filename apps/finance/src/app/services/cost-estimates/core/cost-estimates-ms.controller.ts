import { CostEstimatePatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CostEstimateService } from '../../../api/budget/cost-estimates';

@Controller()
export class CostEstimateMSController {
  constructor(private readonly costEstimateService: CostEstimateService) {}

  @MessagePattern(CostEstimatePatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.costEstimateService.findAll({ page, limit });
  }

  @MessagePattern(CostEstimatePatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.costEstimateService.findById(id);
  }
}
