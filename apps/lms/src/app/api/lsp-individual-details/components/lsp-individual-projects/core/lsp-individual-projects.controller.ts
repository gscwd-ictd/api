import { Controller } from '@nestjs/common';
import { LspIndividualProjectsService } from './lsp-individual-projects.service';

@Controller({ version: '1', path: 'lsp-individual-projects' })
export class LspIndividualProjectsController {
  constructor(private readonly lspIndividualProjectsService: LspIndividualProjectsService) {}
}
