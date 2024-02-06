import { Body, Controller, Post } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { CreateTrainingApprovalDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-approvals' })
export class TrainingApprovalsController {
  constructor(private readonly trainingApprovalsService: TrainingApprovalsService) {}

  @Post()
  async create(@Body() data: CreateTrainingApprovalDto) {
    return await this.trainingApprovalsService.create(data);
  }
}
