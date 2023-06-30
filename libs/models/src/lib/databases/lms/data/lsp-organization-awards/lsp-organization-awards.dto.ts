import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';

export class CreateLspOrganizationAwardDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization award name must be a string' })
  @Length(1, 100, { message: 'lsp organization award name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspOrganizationAwardDto extends PartialType(CreateLspOrganizationAwardDto) {}
