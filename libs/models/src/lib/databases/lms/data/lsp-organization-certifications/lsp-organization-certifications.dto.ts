import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';

export class CreateLspOrganizationCertificationDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization certification name must be a string' })
  @Length(1, 100, { message: 'lsp organization certification name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspOrganizationCertificationDto extends PartialType(CreateLspOrganizationCertificationDto) {}
