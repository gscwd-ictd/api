import { IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { LspIndividualDetails } from '../lsp-individual-details';
import { PartialType } from '@nestjs/swagger';

export class CreateTrainingLspIndividualDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  lspIndividualDetails: LspIndividualDetails;
}

export class UpdateTrainingLspIndividualDto extends PartialType(CreateTrainingLspIndividualDto) {}
