import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class CreateLspAwardDto {
  @IsUUID()
  lspDetails: LspDetails;

  @IsString({ message: 'lsp award name must be a string' })
  @Length(1, 100, { message: 'lsp award name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspAwardDto extends PartialType(CreateLspAwardDto) {}
