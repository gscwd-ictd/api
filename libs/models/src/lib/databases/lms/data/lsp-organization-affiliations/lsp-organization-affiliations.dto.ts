import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';

export class CreateLspOrganizationAffiliationDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization affiliation position must be a string' })
  @Length(1, 100, { message: 'lsp organization affiliation position must be between 1 to 100 characters' })
  position: string;

  @IsString({ message: 'lsp organization affiliation institution must be a string' })
  @Length(1, 100, { message: 'lsp organization affiliation institution must be between 1 to 100 characters' })
  institution: string;
}
export class UpdateLspOrganizationAffiliationDto extends PartialType(CreateLspOrganizationAffiliationDto) {}
