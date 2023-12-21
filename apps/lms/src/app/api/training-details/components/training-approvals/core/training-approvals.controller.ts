import { Body, Controller, Post } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { SubmissionToSecretariateDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-approvals' })
export class TrainingApprovalsController {
  constructor(private readonly trainingApprovalsService: TrainingApprovalsService) {}

  //
  @Post()
  async submissionToSecretariate(@Body() data: SubmissionToSecretariateDto) {
    return await this.trainingApprovalsService.submissionToSecretariate(data);
  }
}
