import { IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { LspDetails } from '../lsp-details';

export class CreateTrainingLspDetailsDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  id: LspDetails;
}
