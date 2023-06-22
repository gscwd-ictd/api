import { Controller } from '@nestjs/common';
import { LspTrainingsService } from './lsp-trainings.service';

@Controller({ version: '1', path: 'lsp-trainings' })
export class LspTrainingsController {
  constructor(private readonly lspTrainingsService: LspTrainingsService) {}
}
