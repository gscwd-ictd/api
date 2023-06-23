import { Controller } from '@nestjs/common';
import { LspIndividualEducationsService } from './lsp-individual-educations.service';

@Controller({ version: '1', path: 'lsp-individual-educations' })
export class LspIndividualEducationsController {
  constructor(private readonly lspIndividualEducationsService: LspIndividualEducationsService) {}
}
