import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetailsDto } from '../lsp-details';

export class TrainingDto {
  @IsString({ message: 'lsp training name must be a string' })
  @Length(1, 100, { message: 'lsp training name must be between 1 to 100 characters' })
  name: string;
}

export class CreateLspTrainingDto extends TrainingDto {
  @IsUUID('4')
  lspDetails: LspDetailsDto;
}

export class UpdateLspTrainingDto extends PartialType(CreateLspTrainingDto) {}
