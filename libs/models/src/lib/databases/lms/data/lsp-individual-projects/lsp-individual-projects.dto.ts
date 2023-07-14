import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspIndividualDetails } from '../lsp-individual-details';

export class CreateLspIndividualProjectDto {
  @IsUUID()
  lspIndividualDetails: LspIndividualDetails;

  @IsString({ message: 'lsp project name must be a string' })
  @Length(1, 100, { message: 'lsp project name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspIndividualProjectDto extends PartialType(CreateLspIndividualProjectDto) {}