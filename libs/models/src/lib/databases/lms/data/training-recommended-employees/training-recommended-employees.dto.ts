import { IsNotEmpty, IsUUID } from 'class-validator';
import { TrainingDistributionDto } from '../training-distributions';

export class TrainingRecommendedEmployeeDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;
}

export class CreateTrainingRecommendedEmployeeDto extends TrainingRecommendedEmployeeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistributionDto;
}
