import { Controller } from '@nestjs/common';
import { LspExperiencesService } from './lsp-experiences.service';

@Controller({ version: '1', path: 'lsp-experiences' })
export class LspExperiencesController {
  constructor(private readonly lspExperiencesService: LspExperiencesService) {}
}
