import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UnitType } from '../unit-type/unit-type.entity';

export class CreateUnitOfMeasureDto {
  @IsUUID(4, { message: 'unit type id is not valid' })
  type: UnitType;

  @IsString({ message: 'unit name must be a string' })
  @Length(1, 20, { message: 'unit name must be between 1 to 20 characters long' })
  name: string;

  @IsString()
  @Length(1, 10, { message: 'unit symbol must be between 1 to 10 characters long' })
  symbol: string;

  @IsOptional()
  @IsString({ message: 'unit description must be a string' })
  description: string;
}

export class UpdateUnitOfMeasureDto extends PartialType(CreateUnitOfMeasureDto) {}
