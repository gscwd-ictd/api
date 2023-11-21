import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class CoachingDto {
  @IsString({ message: 'lsp coaching name must be a string' })
  @Length(1, 100, { message: 'lsp coaching name must be between 1 to 100 characters' })
  name: string;
}

export class CreateLspCoachingDto extends CoachingDto {
  @IsUUID('4')
  lspDetails: LspDetails;
}

export class UpdateLspCoachingDto extends PartialType(CreateLspCoachingDto) {}
