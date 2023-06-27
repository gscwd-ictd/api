import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspIndividualDetails } from '../lsp-individual-details';

export class CreateLspIndividualEducationDto {
  @IsUUID('4')
  lspIndividualDetails: LspIndividualDetails;

  @IsString({ message: 'lsp education degree must be a string' })
  @Length(1, 100, { message: 'lsp education degree must be between 1 to 100 characters' })
  degree: string;

  @IsString({ message: 'lsp education institution must be a string' })
  @Length(1, 100, { message: 'lsp education institution must be between 1 to 100 characters' })
  institution: string;
}
export class UpdateLspIndividualEducationDto extends PartialType(CreateLspIndividualEducationDto) {}
