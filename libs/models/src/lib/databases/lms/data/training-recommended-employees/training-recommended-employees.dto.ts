import { IsUUID } from 'class-validator';
import { TrainingDistribution } from '../training-distributions';

export class CreateTrainingRecommendedEmployeeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistribution;

  @IsUUID('all')
  employeeId: string;
}
