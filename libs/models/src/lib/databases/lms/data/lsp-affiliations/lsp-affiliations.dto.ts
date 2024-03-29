import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetailsDto } from '../lsp-details';

export class AffiliationDto {
  @IsString({ message: 'lsp affiliation position must be a string' })
  @Length(1, 100, { message: 'lsp affiliation position must be between 1 to 100 characters' })
  position: string;

  @IsString({ message: 'lsp affiliation institution must be a string' })
  @Length(1, 100, { message: 'lsp affiliation institution must be between 1 to 100 characters' })
  institution: string;
}

export class CreateLspAffiliationDto extends AffiliationDto {
  @IsUUID('4')
  lspDetails: LspDetailsDto;
}

export class UpdateLspAffiliationDto extends PartialType(CreateLspAffiliationDto) {}
