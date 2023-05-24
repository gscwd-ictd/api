import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class CreateLspTrainingDto {
  @IsUUID()
  lspDetails: LspDetails;

  @IsString({ message: 'lsp training name must be a string' })
  @Length(1, 100, { message: 'lsp training name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspTrainingDto extends PartialType(CreateLspTrainingDto) {}
