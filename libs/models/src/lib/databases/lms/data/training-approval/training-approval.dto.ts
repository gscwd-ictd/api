import { IsNotEmpty, IsNotEmptyObject, IsObject, IsUUID, ValidateNested } from 'class-validator';
import { TrainingDetails } from '../training-details/training-details.entity';
import { TrainingDetailsDto } from '../training-details';
import { Type } from 'class-transformer';

export class CreateTrainingApprovalDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetails;
}

export class SubmissionToSecretariateDto {
  @IsNotEmpty()
  @IsUUID('all')
  pdcSecretary: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDetailsDto)
  trainingDetails: TrainingDetailsDto;
}

export class SubmissionToChairmanDto {
  @IsNotEmpty()
  @IsUUID('all')
  pdcChairman: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDetailsDto)
  trainingDetails: TrainingDetailsDto;
}
