import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
import { TrainingIndividualDistribution } from '../training-individual-distributions';
import { PartialType } from '@nestjs/swagger';
import { TrainingNomineeStatus } from '@gscwd-api/utils';

export class CreateTrainingIndividualNomineeDto {
  @IsUUID('4')
  trainingIndividualDistribution: TrainingIndividualDistribution;

  @IsArray()
  employee: string[];

  @IsString({ message: 'training nominee remarks must be a string' })
  remarks: string;
}

export class UpdateTrainingIndividualNomineeDto extends PartialType(CreateTrainingIndividualNomineeDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingNomineeStatus)
  status: TrainingNomineeStatus;
}
