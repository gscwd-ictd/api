import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetailsDto } from '../lsp-details';

export class AwardDto {
  @IsString({ message: 'lsp award name must be a string' })
  @Length(1, 100, { message: 'lsp award name must be between 1 to 100 characters' })
  name: string;
}

export class CreateLspAwardDto extends AwardDto {
  @IsUUID('4')
  lspDetails: LspDetailsDto;
}

export class UpdateLspAwardDto extends PartialType(CreateLspAwardDto) {}
