import { IsString } from 'class-validator';

export class TrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}
