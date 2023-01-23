import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsString, Length, IsNumber, IsOptional } from 'class-validator';
import { UnitOfMeasure } from '../../../units';
import { PpeCategory } from '../categories/categories.entity';

export class CreatePpeSpecificationDto {
  @IsUUID(4, { message: 'category id is not valid' })
  category: PpeCategory;

  @IsUUID(4, { message: 'unit of measure id is not valid' })
  unit: UnitOfMeasure;

  @IsString({ message: 'specification details must be a string' })
  @Length(1, 100, { message: 'specification details must be between 1 to 100 characters long' })
  details: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'specification quantity must be a valid number' })
  @Type(() => Number)
  quantity: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'reorder quantity must be a valid number' })
  @Type(() => Number)
  reorderQuantity: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'reorder point must be a valid number' })
  @Type(() => Number)
  reorderPoint: number;

  @IsOptional()
  @IsString({ message: 'specification description must be a string' })
  description: string;
}

export class UpdatePpeSpecificationDto extends PartialType(CreatePpeSpecificationDto) {}