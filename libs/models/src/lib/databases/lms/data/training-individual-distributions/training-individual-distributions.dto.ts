import { IsInt, IsUUID } from 'class-validator';
import { TrainingIndividualDetails } from '../training-individual-details';

export class CreateTrainingIndividualDistributionDto {
  @IsUUID('4')
  trainingIndividualDetails: TrainingIndividualDetails;

  @IsUUID('all')
  employeeId: string;

  @IsInt({ message: 'training distribution number of slot must be a number' })
  numberOfSlots: number;
}
