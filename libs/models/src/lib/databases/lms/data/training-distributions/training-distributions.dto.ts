import { IsInt, IsUUID } from 'class-validator';
import { Training } from '../trainings';

export class CreateTrainingDistributionDto {
  @IsUUID('4')
  training: Training;

  @IsUUID('4')
  employeeId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;
}
