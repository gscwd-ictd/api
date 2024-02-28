import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TrainingNomineeDto } from '../training-nominees';

export class TrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}

export class CreateTrainingRequirementsDto {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: TrainingNomineeDto;
}
