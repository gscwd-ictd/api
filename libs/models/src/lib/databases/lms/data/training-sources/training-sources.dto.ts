import { PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTrainingSourceDto {
  @IsString({ message: 'training source name must be a string' })
  @Length(1, 50, { message: 'training source name must be between 1 to 50 characters' })
  name: string;
}

export class UpdateTrainingSourceDto extends PartialType(CreateTrainingSourceDto) {}
