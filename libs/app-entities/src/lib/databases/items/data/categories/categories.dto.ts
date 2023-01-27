import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ItemClassification } from '../classifications/classifications.entity';

export class CreateItemCategoryDto {
  @IsUUID(4, { message: 'classification id is not valid' })
  classification: ItemClassification;

  @IsString({ message: 'category name must be a string' })
  @Length(1, 50, { message: 'category name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'classification description must be a string' })
  description: string;
}

export class UpdateItemCategoryDto extends PartialType(CreateItemCategoryDto) {}
