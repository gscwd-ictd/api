import { Controller } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}
}
