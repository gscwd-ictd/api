import { Controller } from '@nestjs/common';
import { LspOrganizationTrainingsService } from './lsp-organization-trainings.service';

@Controller({ version: '1', path: 'lsp-organization-trainings' })
export class LspOrganizationTrainingsController {
  constructor(private readonly lspOrganizationTrainingsService: LspOrganizationTrainingsService) {}
}
