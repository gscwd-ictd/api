import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { TrainingDetailsDto } from '../training-details';
import { Type } from 'class-transformer';

export class CreateTrainingApprovalDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}

export class PdcSecretariatDto {
  @IsNotEmpty()
  @IsUUID('all')
  pdcSecretariat: string;

  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;

  @IsOptional()
  @IsString({ message: 'training nominee remarks must be string' })
  remarks: string;
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

  @IsOptional()
  @IsString({ message: 'training nominee remarks must be string' })
  remarks: string;
}

export class GeneralManagerDto {
  @IsNotEmpty()
  @IsUUID('all')
  generalManager: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDetailsDto)
  trainingDetails: TrainingDetailsDto;

  @IsOptional()
  @IsString({ message: 'training nominee remarks must be string' })
  remarks: string;
}
