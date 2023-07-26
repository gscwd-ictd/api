import { Controller } from '@nestjs/common';
import { TrainingLspOrganizationService } from './training-lsp-organization.service';

@Controller({ version: '1', path: 'training-lsp-organization' })
export class TrainingLspOrganizationController {
  constructor(private readonly trainingLspOrganizationService: TrainingLspOrganizationService) {}
}
