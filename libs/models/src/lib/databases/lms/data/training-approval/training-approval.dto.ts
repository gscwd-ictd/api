import { IsNotEmpty, IsNotEmptyObject, IsObject, IsUUID, ValidateNested } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';
import { Type } from 'class-transformer';

export class CreateTrainingApprovalDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}

export class PdcSecretaryDto {
  @IsNotEmpty()
  @IsUUID('all')
  pdcSecretary: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDetailsDto)
  trainingDetails: TrainingDetailsDto;
}

export class PdcChairmanDto {
  @IsNotEmpty()
  @IsUUID('all')
  pdcChairman: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDetailsDto)
  trainingDetails: TrainingDetailsDto;
}
