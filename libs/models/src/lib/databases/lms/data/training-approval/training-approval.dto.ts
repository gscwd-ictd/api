import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';

export class CreateTrainingApprovalDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}

export class TddManagerDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: string;

  @IsNotEmpty()
  @IsUUID('all')
  tddManager: string;

  @IsOptional()
  @IsString({ message: 'remarks must be string.' })
  remarks: string;
}

export class PdcSecretariatDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: string;

  @IsNotEmpty()
  @IsUUID('all')
  pdcSecretariat: string;

  @IsOptional()
  @IsString({ message: 'remarks must be string.' })
  remarks: string;
}

export class PdcChairmanDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: string;

  @IsNotEmpty()
  @IsUUID('all')
  pdcChairman: string;

  @IsOptional()
  @IsString({ message: 'remarks must be string.' })
  remarks: string;
}

export class GeneralManagerDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: string;

  @IsNotEmpty()
  @IsUUID('all')
  generalManager: string;

  @IsOptional()
  @IsString({ message: 'remarks must be string.' })
  remarks: string;
}
