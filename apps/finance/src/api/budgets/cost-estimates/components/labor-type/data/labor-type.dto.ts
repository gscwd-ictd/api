import { PartialType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateLaborTypeDto {
  @IsString()
  @MaxLength(50, { message: 'Description name is too long.' })
  description: string;
}

export class UpdateLaborTypeDto extends PartialType(CreateLaborTypeDto) {}
