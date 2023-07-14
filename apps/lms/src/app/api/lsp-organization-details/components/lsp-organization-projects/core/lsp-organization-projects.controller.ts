import { Controller } from '@nestjs/common';
import { LspOrganizationProjectsService } from './lsp-organization-projects.service';

@Controller({ version: '1', path: 'lsp-organization-projects' })
export class LspOrganizationProjectsController {
  constructor(private readonly lspOrganizationProjectsService: LspOrganizationProjectsService) {}
}
