import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ItemClassification } from '../../classification';

export class CreateItemCategoryDto {
  @IsUUID()
  classification: ItemClassification;

  @IsString()
  @MaxLength(50, { message: 'Classification name is too long.' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateItemCategoryDto extends PartialType(CreateItemCategoryDto) {}
