import { Controller } from '@nestjs/common';
import { LspOrganizationCertificationsService } from './lsp-organization-certifications.service';

@Controller({ version: '1', path: 'lsp-organization-certifications' })
export class LspOrganizationCertificationsController {
  constructor(private readonly lspOrganizationCertificationsService: LspOrganizationCertificationsService) {}
}
