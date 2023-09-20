import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TrainingRecommendedEmployeeDto } from '../training-recommended-employees';
import { Training } from '../trainings';

//insert training distribution dto
export class CreateTrainingDistributionDto {
  @IsUUID('4')
  training: Training;

  @IsUUID('all')
  supervisorId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;
}

//for training details dto
export class TrainingDistributionDto {
  @IsUUID('all')
  supervisorId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingRecommendedEmployeeDto)
  recommendedEmployee: TrainingRecommendedEmployeeDto[];
}
