import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TrainingDistribution } from '../training-distributions';
import { PartialType } from '@nestjs/swagger';
import { NomineeType, TrainingNomineeStatus } from '@gscwd-api/utils';

export class CreateTrainingNomineeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistribution;

  @IsArray()
  employee: string[];

  @IsEnum(NomineeType)
  @IsNotEmpty()
  nomineeType: NomineeType;

  @IsString({ message: 'training nominee remarks must be a string' })
  remarks: string;
}

export class UpdateTrainingNomineeDto extends PartialType(CreateTrainingNomineeDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsEnum(TrainingNomineeStatus)
  status: TrainingNomineeStatus;
}

export class UpdateTrainingNomineeStatusDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsEnum(TrainingNomineeStatus)
  status: TrainingNomineeStatus;
}
