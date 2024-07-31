import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';
import { TrainingHistoryType } from '@gscwd-api/utils';

export class CreateTrainingHistoryDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;

  @IsNotEmpty()
  @IsEnum(TrainingHistoryType)
  trainingHistoryType: TrainingHistoryType;
}
