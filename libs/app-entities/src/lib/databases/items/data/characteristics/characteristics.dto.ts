import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateItemCharacteristicDto {
  @IsString({ message: 'characteristic code must be a string' })
  @Length(3, 3, { message: 'characteristic code must be 3 characters long' })
  code: string;

  @IsString({ message: 'characteristic name must be a string.' })
  @Length(1, 50, { message: 'characteristic name must be between 1 to 50 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'characteristic description must be a string' })
  description: string;
}

export class UpdateItemCharacteristicDto extends PartialType(CreateItemCharacteristicDto) {}
