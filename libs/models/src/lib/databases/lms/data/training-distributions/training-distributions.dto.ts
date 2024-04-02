import { IsArray, IsInt, IsNotEmpty, IsObject, IsUUID, ValidateNested } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';
import { Type } from 'class-transformer';
import { TrainingRecommendedEmployeeDto } from '../training-recommended-employees';

export class Supervisor {
  @IsNotEmpty()
  @IsUUID('all')
  supervisorId: string;
}

export class TrainingDistributionDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class SlotDistributionDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Supervisor)
  supervisor: Supervisor;

  @IsNotEmpty()
  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingRecommendedEmployeeDto)
  employees: Array<TrainingRecommendedEmployeeDto>;
}

export class CreateTrainingDistributionDto extends SlotDistributionDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}
