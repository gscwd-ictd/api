import { IsArray, IsInt, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { Type } from 'class-transformer';
import { CreateTrainingRecommendedEmployeeDto } from '../training-recommended-employees';

export class CreateTrainingDistributionDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('all')
  @IsNotEmpty()
  supervisorId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  @IsNotEmpty()
  numberOfSlots: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingRecommendedEmployeeDto)
  recommendedEmployees: CreateTrainingRecommendedEmployeeDto[];
}
