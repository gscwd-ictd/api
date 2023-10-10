import { IsString } from 'class-validator';

export class TrainingRequirements {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}
