import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ItemSpecification } from '../specifications/specifications.entity';

export class CreateItemDetailsDto {
  @IsUUID(4, { message: 'specification id is not valid' })
  specification: ItemSpecification;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'balance must be a valid number' })
  @Type(() => Number)
  balance: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'reorder point must be a valid number' })
  @Type(() => Number)
  reorderPoint: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'reorder quantity must be a valid number' })
  @Type(() => Number)
  reorderQuantity: number;
}

export class UpdateItemDetailsDto extends PartialType(CreateItemDetailsDto) {}
