import { IsNotEmpty, IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { LspDetails } from '../lsp-details';

export class TrainingLspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: LspDetails;
}

export class CreateTrainingLspDetailsDto extends TrainingLspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetails;
}
