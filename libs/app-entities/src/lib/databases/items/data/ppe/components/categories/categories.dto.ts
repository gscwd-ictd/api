import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { PpeClassification } from '../classifications/classifications.entity';

export class CreatePpeCategoryDto {
  @IsUUID(4, { message: 'ppe classification id is not valid' })
  classification: PpeClassification;

  @IsString({ message: 'pee classification name must be a string' })
  @Length(1, 50, { message: 'ppe classification name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'ppe description must be a string' })
  description: string;
}

export class UpdatePpeCategoryDto extends PartialType(CreatePpeCategoryDto) {}
