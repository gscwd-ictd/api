import { Controller } from '@nestjs/common';
import { LspOrganizationEducationsService } from './lsp-organization-educations.service';

@Controller({ version: '1', path: 'lsp-organization-educations' })
export class LspOrganizationEducationsController {
  constructor(private readonly lspOrganizationEducationsService: LspOrganizationEducationsService) {}
}
