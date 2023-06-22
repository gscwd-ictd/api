import { Controller } from '@nestjs/common';
import { LspIndividualAwardsService } from './lsp--individual-awards.service';

@Controller({ version: '1', path: 'lsp-individual-awards' })
export class LspIndividualAwardsController {
  constructor(private readonly lspIndividualAwardsService: LspIndividualAwardsService) {}
}
