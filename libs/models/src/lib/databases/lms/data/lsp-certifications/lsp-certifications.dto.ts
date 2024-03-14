import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetailsDto } from '../lsp-details';

export class CertificationDto {
  @IsString({ message: 'lsp certification name must be a string' })
  @Length(1, 100, { message: 'lsp certification name must be between 1 to 100 characters' })
  name: string;
}

export class CreateLspCertificationDto extends CertificationDto {
  @IsUUID('4')
  lspDetails: LspDetailsDto;
}

export class UpdateLspCertificationDto extends PartialType(CreateLspCertificationDto) {}
