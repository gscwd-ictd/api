import { IsInt, IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';

export class CreateTrainingDistributionDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('all')
  employeeId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;
}
