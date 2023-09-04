import { IsUUID } from 'class-validator';
import { TrainingDistribution } from '../training-distributions';

//dto for insert recommended employeee
export class CreateTrainingRecommendedEmployeeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistribution;

  @IsUUID('all')
  employeeId: string;
}

//for training details dto
export class TrainingRecommendedEmployeeDto {
  @IsUUID('all')
  employeeId: string;
}
