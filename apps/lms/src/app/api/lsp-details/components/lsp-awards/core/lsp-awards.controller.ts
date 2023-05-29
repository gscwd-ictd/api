import { Controller } from '@nestjs/common';
import { LspAwardsService } from './lsp-awards.service';

@Controller({ version: '1', path: 'lsp-awards' })
export class LspAwardsController {
  constructor(private readonly lspAwardsService: LspAwardsService) {}
}
