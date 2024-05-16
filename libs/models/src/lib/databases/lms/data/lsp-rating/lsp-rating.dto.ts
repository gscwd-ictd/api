import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { LspDetailsDto } from '../lsp-details';
import { TrainingDetailsDto } from '../training-details';
import { PartialType } from '@nestjs/swagger';

export class LspRatingDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}

export class CreateLspRatingDto {
  @IsNotEmpty()
  @IsUUID('4')
  lspDetails: LspDetailsDto;

  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}

export class UpdateLspRatingDto extends PartialType(LspRatingDto) {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
