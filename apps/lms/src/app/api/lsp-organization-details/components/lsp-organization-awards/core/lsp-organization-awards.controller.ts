import { Controller } from '@nestjs/common';
import { LspOrganizationAwardsService } from './lsp-organization-awards.service';

@Controller({ version: '1', path: 'lsp-organization-awards' })
export class LspOrganizationAwardsController {
  constructor(private readonly lspOrganizationAwardsService: LspOrganizationAwardsService) {}
}
