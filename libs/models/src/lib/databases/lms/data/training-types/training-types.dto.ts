import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTrainingTypeDto {
  @IsString({ message: 'training type name must be a string' })
  @Length(1, 60, { message: 'training type name must be between 1 to 50 characters' })
  name: string;

  @IsString({ message: 'training type description must be a string' })
  @IsOptional()
  description: string;
}

export class UpdateTrainingTypeDto extends PartialType(CreateTrainingTypeDto) {}
