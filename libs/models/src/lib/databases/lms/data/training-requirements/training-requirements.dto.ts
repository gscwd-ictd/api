import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TrainingNomineeDto } from '../training-nominees';

export class TrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}

export class RequirementsDto {
  preTest: boolean;
  courseMaterials: boolean;
  postTrainingReport: boolean;
  courseEvaluationReport: boolean;
  learningApplicationPlan: boolean;
  postTest: boolean;
  certificateOfTraining: boolean;
  certificateOfAppearance: boolean;
  program: boolean;
}

export class CreateTrainingRequirementsDto {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: TrainingNomineeDto;
}
