import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUnitTypeDto {
  @IsString({ message: 'unit type must be a string' })
  type: string;

  @IsOptional()
  @IsString({ message: 'unit description must be a string' })
  description: string;
}

export class UpdateUnitTypeDto extends PartialType(CreateUnitTypeDto) {}
