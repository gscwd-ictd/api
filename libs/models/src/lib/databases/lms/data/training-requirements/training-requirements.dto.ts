import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TrainingNomineeDto } from '../training-nominees';
import { PartialType } from '@nestjs/swagger';

export class TrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}

export class RequirementsDto {
  @IsNotEmpty({ message: 'pre-test must not be empty' })
  @IsBoolean({ message: 'pre-test must be boolean' })
  preTest: boolean;

  @IsNotEmpty({ message: 'course materials must not be empty' })
  @IsBoolean({ message: 'course materials must be boolean' })
  courseMaterials: boolean;

  @IsNotEmpty({ message: 'post training report must not be empty' })
  @IsBoolean({ message: 'post training report must be boolean' })
  postTrainingReport: boolean;

  @IsNotEmpty({ message: 'course evaluation report must not be empty' })
  @IsBoolean({ message: 'course evaluation report must be boolean' })
  courseEvaluationReport: boolean;

  @IsNotEmpty({ message: 'learning application plan must not be empty' })
  @IsBoolean({ message: 'learning application plan must be boolean' })
  learningApplicationPlan: boolean;

  @IsNotEmpty({ message: 'post-test must not be empty' })
  @IsBoolean({ message: 'post-test must be boolean' })
  postTest: boolean;

  @IsNotEmpty({ message: 'certificate of training must not be empty' })
  @IsBoolean({ message: 'certificate of training must be boolean' })
  certificateOfTraining: boolean;

  @IsNotEmpty({ message: 'certificate of appearance must not be empty' })
  @IsBoolean({ message: 'certificate of appearance must be boolean' })
  certificateOfAppearance: boolean;

  @IsNotEmpty({ message: 'program must not be empty' })
  @IsBoolean({ message: 'program must be boolean' })
  program: boolean;
}

export class AttendanceDto extends RequirementsDto {
  @IsNotEmpty({ message: 'attendance must not be empty' })
  @IsBoolean({ message: 'attendance must be boolean' })
  attendance: boolean;
}

export class CreateTrainingRequirementsDto {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: TrainingNomineeDto;
}

export class UpdateTrainingRequirementsDto extends PartialType(AttendanceDto) {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: string;
}
