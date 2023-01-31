import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ItemCategory } from '../categories/categories.entity';
import { CreateItemDetailsDto } from '../details';
import { UnitOfMeasure } from '../unit-of-measure';

export class CreateItemSpecificationDto extends CreateItemDetailsDto {
  @IsUUID(4, { message: 'category id is not valid.' })
  category: ItemCategory;

  @IsUUID(4, { message: 'unit id is not valid' })
  unit: UnitOfMeasure;

  @IsString({ message: 'specification name must be a string' })
  @Length(1, 100, { message: 'specification name must be between 1 to 100 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'specification description must be a string' })
  description: string;
}

export class UpdateItemSpecificationDto extends PartialType(CreateItemSpecificationDto) {}

// const spec = {} as CreateItemSpecificationDto;
