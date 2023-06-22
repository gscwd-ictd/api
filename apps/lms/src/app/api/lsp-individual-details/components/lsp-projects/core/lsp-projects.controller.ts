import { Controller } from '@nestjs/common';
import { LspProjectsService } from './lsp-projects.service';

@Controller({ version: '1', path: 'lsp-projects' })
export class LspProjectsController {
  constructor(private readonly lspProjectsService: LspProjectsService) {}
}
