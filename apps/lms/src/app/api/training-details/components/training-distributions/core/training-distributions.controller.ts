import { Controller } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';

@Controller({ version: '1', path: 'training-distributions' })
export class TrainingDistributionsController {
  constructor(private readonly trainingDistributionsService: TrainingDistributionsService) {}
}
