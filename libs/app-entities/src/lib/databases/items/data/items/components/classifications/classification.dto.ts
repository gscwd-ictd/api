import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ItemCharacteristic } from '../characteristics/characteristics.entity';

export class CreateItemClassificationDto {
  @IsUUID(4, { message: 'characteristic id is not valid' })
  characteristic: ItemCharacteristic;

  @IsString({ message: 'classification code must be a string' })
  @Length(3, 3, { message: 'classification code must be 3 characters long' })
  code: string;

  @IsString({ message: 'classification name must be a string' })
  @Length(1, 50, { message: 'classification name must be between 1 to 50 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'classification description must be a string' })
  description: string;
}

export class UpdateItemClassificationDto extends PartialType(CreateItemClassificationDto) {}
