import { Controller } from '@nestjs/common';
import { LspIndividualCertificationsService } from './lsp-individual-certifications.service';

@Controller({ version: '1', path: 'lsp-individual-certifications' })
export class LspIndividualCertificationsController {
  constructor(private readonly lspIndividualCertificationsService: LspIndividualCertificationsService) {}
}
