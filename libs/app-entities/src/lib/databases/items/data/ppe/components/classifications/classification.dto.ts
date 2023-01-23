import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ItemCharacteristic } from '../../../items';

export class CreatePpeClassificationDto {
  @IsUUID(4, { message: 'item characteristic is not valid.' })
  characteristic: ItemCharacteristic;

  @IsString({ message: 'ppe classification code must be a string' })
  @Length(3, 3, { message: 'ppe classification code must be 3 characters long' })
  code: string;

  @IsString({ message: 'ppe classification name must be a string' })
  @Length(1, 50, { message: 'ppe classification name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'ppe description must be a string' })
  description: string;
}

export class UpdatePpeClassificationDto extends PartialType(CreatePpeClassificationDto) {}
