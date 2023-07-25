import { IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { LspOrganizationDetails } from '../lsp-organization-details';
import { PartialType } from '@nestjs/swagger';

export class CreateTrainingLspOrganizationDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;
}

export class UpdateTrainingLspOrganizationDto extends PartialType(CreateTrainingLspOrganizationDto) {}
