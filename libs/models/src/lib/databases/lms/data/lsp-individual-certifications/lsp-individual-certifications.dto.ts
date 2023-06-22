import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class CreateLspIndividualCertificationDto {
  @IsUUID()
  lspDetails: LspDetails;

  @IsString({ message: 'lsp individual certification name must be a string' })
  @Length(1, 100, { message: 'lsp individual certification name must be between 1 to 100 characters' })
  name: string;
}

export class UpdateLspIndividualCertificationDto extends PartialType(CreateLspIndividualCertificationDto) {}
