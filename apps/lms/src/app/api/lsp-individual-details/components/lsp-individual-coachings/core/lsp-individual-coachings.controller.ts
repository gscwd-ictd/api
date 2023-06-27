import { Controller } from '@nestjs/common';
import { LspIndividualCoachingsService } from './lsp-individual-coachings.service';

@Controller({ version: '1', path: 'lsp-individual-coachings' })
export class LspIndividualCoachingsController {
  constructor(private readonly lspIndividualCoachingsService: LspIndividualCoachingsService) {}
}
