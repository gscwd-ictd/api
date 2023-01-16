//! perhaps just one dto? i.e. ItemCharacteristicDto

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateItemCharacteristicsDto {
  @IsString()
  @MinLength(3, { message: 'Characteristic code should be 3 characters long.' })
  @MaxLength(3, { message: 'Characteristic code should be 3 characters long.' })
  code: string;

  @IsString()
  @MaxLength(50, { message: 'Characteristic name is too long.' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateItemCharacteristicsDto extends CreateItemCharacteristicsDto {}
