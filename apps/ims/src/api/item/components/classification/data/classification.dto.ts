import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ItemCharacteristic } from '../../characteristic';

export class CreateItemClassificationDto {
  @IsUUID()
  characteristic: ItemCharacteristic;

  @IsString()
  @Length(3, 3, { message: 'classification code must be 3 characters long' })
  code: string;

  @IsString()
  @Length(1, 50, { message: 'classification name must be between 1 and 50 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateItemClassificationDto extends PartialType(CreateItemClassificationDto) {}
