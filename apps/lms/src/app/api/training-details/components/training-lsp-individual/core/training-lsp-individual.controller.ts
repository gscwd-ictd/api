import { Controller } from '@nestjs/common';
import { TrainingLspIndividualService } from './training-lsp-individual.service';

@Controller({ version: '1', path: 'training-lsp-individual' })
export class TrainingLspIndividualController {
  constructor(private readonly trainingLspIndividualService: TrainingLspIndividualService) {}
}
