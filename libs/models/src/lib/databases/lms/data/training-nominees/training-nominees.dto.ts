import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TrainingDistribution } from '../training-distributions';
import { PartialType } from '@nestjs/swagger';
import { TrainingNomineeStatus } from '@gscwd-api/utils';

export class CreateTrainingNomineeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistribution;

  @IsUUID('4')
  employeeId: string;

  @IsString({ message: 'training nominee remarks must be a string' })
  remarks: string;
}

export class UpdateTrainingNomineeDto extends PartialType(CreateTrainingNomineeDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingNomineeStatus)
  status: TrainingNomineeStatus;
}
