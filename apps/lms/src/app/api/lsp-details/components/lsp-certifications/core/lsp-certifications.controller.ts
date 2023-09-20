import { Controller } from '@nestjs/common';
import { LspCertificationsService } from './lsp-certifications.service';

@Controller({ version: '1', path: 'lsp-certifications' })
export class LspCertificationsController {
  constructor(private readonly lspCertificationsService: LspCertificationsService) {}
}
