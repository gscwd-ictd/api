import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { LspDetails } from '../lsp-details';

export class Projects {
  @IsString({ message: 'lsp organization project name must be a string' })
  @Length(1, 100, { message: 'lsp organization project name must be between 1 to 100 characters' })
  name: string;
}

export class CreateLspProjectDto {
  @IsUUID('4')
  lspDetails: LspDetails;
}

export class UpdateLspProjectDto extends PartialType(CreateLspProjectDto) {}
