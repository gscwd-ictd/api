import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspIndividualDetails } from '../lsp-individual-details';

export class CreateLspIndividualAffiliationDto {
  @IsUUID('4')
  lspIndividualDetails: LspIndividualDetails;

  @IsString({ message: 'lsp individual affiliation position must be a string' })
  @Length(1, 100, { message: 'lsp individual affiliation position must be between 1 to 100 characters' })
  position: string;

  @IsString({ message: 'lsp individual affiliation institution must be a string' })
  @Length(1, 100, { message: 'lsp individual affiliation institution must be between 1 to 100 characters' })
  institution: string;
}
export class UpdateLspIndividualAffiliationDto extends PartialType(CreateLspIndividualAffiliationDto) {}
