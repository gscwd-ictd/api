import { Controller } from '@nestjs/common';
import { LspIndividualTrainingsService } from './lsp-individual-trainings.service';

@Controller({ version: '1', path: 'lsp-individual-trainings' })
export class LspIndividualTrainingsController {
  constructor(private readonly lspIndividualTrainingsService: LspIndividualTrainingsService) {}
}
