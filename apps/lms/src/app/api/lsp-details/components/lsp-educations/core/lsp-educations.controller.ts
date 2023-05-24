import { Controller } from '@nestjs/common';
import { LspEducationsService } from './lsp-educations.service';

@Controller({ version: '1', path: 'lsp-educations' })
export class LspEducationsController {
  constructor(private readonly lspEducationsService: LspEducationsService) {}
}
