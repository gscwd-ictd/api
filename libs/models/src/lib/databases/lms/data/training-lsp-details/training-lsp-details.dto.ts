import { IsNotEmpty, IsUUID } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';
import { LspDetailsDto } from '../lsp-details';

export class TrainingLspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: LspDetailsDto;
}

export class CreateTrainingLspDetailsDto extends TrainingLspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}
