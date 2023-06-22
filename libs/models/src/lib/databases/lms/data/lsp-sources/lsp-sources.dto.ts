import { PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateLspSourceDto {
  @IsString({ message: 'lsp source name must be a string' })
  @Length(1, 50, { message: 'lsp source name must be between 1 to 50 characters' })
  name: string;
}

export class UpdateLspSourceDto extends PartialType(CreateLspSourceDto) {}
