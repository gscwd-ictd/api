import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';

export class CreateLspOrganizationEducationDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization education degree must be a string' })
  @Length(1, 100, { message: 'lsp organization education degree must be between 1 to 100 characters' })
  degree: string;

  @IsString({ message: 'lsp organization education institution must be a string' })
  @Length(1, 100, { message: 'lsp organization education institution must be between 1 to 100 characters' })
  institution: string;
}
export class UpdateLspOrganizationEducationDto extends PartialType(CreateLspOrganizationEducationDto) {}
