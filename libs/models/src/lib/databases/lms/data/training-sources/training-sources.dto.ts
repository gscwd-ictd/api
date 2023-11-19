import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class TrainingSourceDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class CreateTrainingSourceDto {
  @IsNotEmpty()
  @IsString({ message: 'training source name must be a string' })
  @Length(1, 50, { message: 'training source name must be between 1 to 50 characters' })
  name: string;
}

export class UpdateTrainingSourceDto extends PartialType(CreateTrainingSourceDto) {}
