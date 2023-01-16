import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { UnitOfMeasure } from '../../../../unit/components/unit-of-measure';
import { ItemCategory } from '../../category';

export class CreateItemSpecificationDto {
  @IsUUID()
  category: ItemCategory;

  @IsUUID()
  unit: UnitOfMeasure;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  reorderPoint: number;

  @IsNumber()
  @Type(() => Number)
  reorderQuantity: number;

  @IsString()
  @MaxLength(100, { message: 'specification details is too long' })
  details: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateItemSpecificationDto extends PartialType(CreateItemSpecificationDto) {}
