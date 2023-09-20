import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsString, Length } from 'class-validator';

export class CreateTrainingDesignDto {
  @IsString({ message: 'training design course title must be a string' })
  @Length(1, 100, { message: 'training design course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsString({ message: 'training design course description must be a string' })
  courseDescription: string;

  @IsString({ message: 'training design course objective must be a string' })
  courseObjective: string;

  @IsString({ message: 'training design rationale must be a string' })
  rationale: string;

  @IsString({ message: 'training design target participants must be a string' })
  targetParticipants: string;

  @IsString({ message: 'training design methodologies must be a string' })
  methodologies: string;

  @IsString({ message: 'training design expected output must be a string' })
  expectedOutput: string;

  @IsString({ message: 'training design recognition must be a string' })
  recognition: string;

  @IsDateString()
  trainingStart: Date;

  @IsDateString()
  trainingEnd: Date;
}

export class UpdateTrainingDesignDto extends PartialType(CreateTrainingDesignDto) {}
