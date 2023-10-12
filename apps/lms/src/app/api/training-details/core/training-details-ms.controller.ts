import { Controller } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';

@Controller()
export class TrainingDetailsMicroserviceController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  //   @MessagePattern(CostEstimatePatterns.FIND_ALL)
  //   async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
  //     return await this.costEstimateService.findAll({ page, limit });
  //   }

  //   @MessagePattern(CostEstimatePatterns.FIND_BY_ID)
  //   async findOneBy(@Payload('id') id: string) {
  //     return await this.costEstimateService.findById(id);
  //   }
}
