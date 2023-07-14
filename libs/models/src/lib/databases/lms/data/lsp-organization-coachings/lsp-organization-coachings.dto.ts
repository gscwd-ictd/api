import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';
import { PartialType } from '@nestjs/swagger';

export class CreateLspOrganizationCoachingDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization coaching name must be a string' })
  @Length(1, 100, { message: 'lsp organization coaching name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspOrganizationCoachingDto extends PartialType(CreateLspOrganizationCoachingDto) {}
