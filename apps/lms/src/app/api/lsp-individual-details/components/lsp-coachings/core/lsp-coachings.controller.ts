import { Controller } from '@nestjs/common';
import { LspCoachingsService } from './lsp-coachings.service';

@Controller({ version: '1', path: 'lsp-coachings' })
export class LspCoachingsController {
  constructor(private readonly lspCoachingsService: LspCoachingsService) {}
}
