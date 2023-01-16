import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UnitType } from '../../unit-type';

export class CreateUnitOfMeasureDto {
  @IsUUID()
  type: UnitType;

  @IsString()
  @Length(1, 20, { message: 'unit name must be between 1 and 20 characters long' })
  name: string;

  @IsString()
  @Length(1, 10, { message: 'unit symbol must be between 1 and 10 characters long' })
  symbol: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateUnitOfMeasureDto extends PartialType(OmitType(CreateUnitOfMeasureDto, ['type'])) {}
