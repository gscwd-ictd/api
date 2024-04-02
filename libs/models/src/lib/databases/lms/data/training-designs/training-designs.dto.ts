import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID, Length } from 'class-validator';

export class TrainingDesignDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class CreateTrainingDesignDto {
  @IsNotEmpty({ message: 'training design course title must not be empty' })
  @IsString({ message: 'training design course title must be a string' })
  @Length(1, 200, { message: 'training design course title must be between 1 to 200 characters' })
  courseTitle: string;

  @IsObject({ message: 'training design course description must be a object' })
  courseDescription: object;

  @IsObject({ message: 'training design course objective must be a object' })
  courseObjective: object;

  @IsObject({ message: 'training design rationale must be a object' })
  rationale: object;

  @IsObject({ message: 'training design target participants must be a object' })
  targetParticipants: object;

  @IsObject({ message: 'training design methodologies must be a object' })
  methodologies: object;

  @IsObject({ message: 'training design expected output must be a object' })
  expectedOutput: object;

  @IsObject({ message: 'training design recognition must be a object' })
  recognition: object;
}

export class UpdateTrainingDesignDto extends PartialType(CreateTrainingDesignDto) {}
