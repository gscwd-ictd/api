import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUnitTypeDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateUnitTypeDto extends PartialType(CreateUnitTypeDto) {}
