import { PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTrainingTypeDto {
  @IsString({ message: 'training type name must be a string' })
  @Length(1, 50, { message: 'training type name must be between 1 to 50 characters' })
  name: string;
}

export class UpdateTrainingTypeDto extends PartialType(CreateTrainingTypeDto) {}
