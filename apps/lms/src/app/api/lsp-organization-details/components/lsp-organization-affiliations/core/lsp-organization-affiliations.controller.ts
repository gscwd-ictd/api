import { Controller } from '@nestjs/common';
import { LspOrganizationAffiliationsService } from './lsp-organization-affiliations.service';

@Controller({ version: '1', path: 'lsp-organization-affiliations' })
export class LspOrganizationAffiliationsController {
  constructor(private readonly lspOrganizationAffiliationsService: LspOrganizationAffiliationsService) {}
}
