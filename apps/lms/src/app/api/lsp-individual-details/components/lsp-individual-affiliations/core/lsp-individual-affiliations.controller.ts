import { Controller } from '@nestjs/common';
import { LspIndividualAffiliationsService } from './lsp-individual-affiliations.service';

@Controller({ version: '1', path: 'lsp-individual-affiliations' })
export class LspIndividualAffiliationsController {
  constructor(private readonly lspIndividualAffiliationsService: LspIndividualAffiliationsService) {}
}
