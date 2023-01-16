import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateItemCharacteristicsDto {
  @IsString()
  @Length(3, 3, { message: 'Characteristic code must be 3 characters long.' })
  code: string;

  @IsString()
  @MaxLength(50, { message: 'Characteristic name is too long.' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateItemCharacteristicsDto extends PartialType(CreateItemCharacteristicsDto) {}
