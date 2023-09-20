import { Controller } from '@nestjs/common';
import { LspAffiliationsService } from './lsp-affiliations.service';

@Controller({ version: '1', path: 'lsp-affiliations' })
export class LspAffiliationsController {
  constructor(private readonly lspAffiliationsService: LspAffiliationsService) {}
}
