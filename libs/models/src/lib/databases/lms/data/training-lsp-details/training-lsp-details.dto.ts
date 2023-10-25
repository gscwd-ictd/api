import { IsNotEmpty, IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { LspDetails } from '../lsp-details';

export class CreateTrainingLspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsNotEmpty()
  @IsUUID('4')
  lspDetailsId: LspDetails;
}
