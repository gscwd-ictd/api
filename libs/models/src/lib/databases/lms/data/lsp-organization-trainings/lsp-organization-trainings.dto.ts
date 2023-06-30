import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspOrganizationDetails } from '../lsp-organization-details';

export class CreateLspOrganizationTrainingDto {
  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'lsp organization training name must be a string' })
  @Length(1, 100, { message: 'lsp organization training name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspOrganizationTrainingDto extends PartialType(CreateLspOrganizationTrainingDto) {}
