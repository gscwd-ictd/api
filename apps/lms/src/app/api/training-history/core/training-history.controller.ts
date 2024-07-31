import { Controller } from '@nestjs/common';
import { TrainingHistoryService } from './training-history.service';

@Controller({ version: '1', path: 'training-history' })
export class TrainingHistoryController {
  constructor(private readonly trainingHistoryService: TrainingHistoryService) {}
}
