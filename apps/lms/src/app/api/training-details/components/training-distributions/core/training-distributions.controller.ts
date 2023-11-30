import { Controller, Get, Param } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';

@Controller({ version: '1', path: 'training-distributions' })
export class TrainingDistributionsController {
  constructor(private readonly trainingDistributionsService: TrainingDistributionsService) {}

  // microservices test
  @Get('supervisor/:id')
  async findTrainingDistributionSupervisorId(@Param('id') id: string) {
    return await this.trainingDistributionsService.findTrainingDistributionSupervisorId(id);
  }
}
