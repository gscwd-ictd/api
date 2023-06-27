import { Controller } from '@nestjs/common';
import { LspOrganizationCoachingsService } from './lsp-organization-coachings.service';

@Controller({ version: '1', path: 'lsp-organization-coachings' })
export class LspOrganizationCoachingsController {
  constructor(private readonly lspOrganizationCoachingsService: LspOrganizationCoachingsService) {}
}
