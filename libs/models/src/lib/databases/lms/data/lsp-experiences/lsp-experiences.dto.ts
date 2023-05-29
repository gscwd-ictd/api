import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class CreateLspExperienceDto {
  @IsUUID()
  lspDetails: LspDetails;

  @IsNumber()
  numberOfYears: number;
}

export class UpdateLspExperienceDto extends PartialType(CreateLspExperienceDto) {}
