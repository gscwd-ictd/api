import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { NomineeType, TrainingNomineeStatus } from '@gscwd-api/utils';
import { TrainingDistributionDto } from '../training-distributions';
import { Type } from 'class-transformer';

export class TrainingNomineeDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class NomineeDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;

  @IsNotEmpty()
  @IsEnum(NomineeType)
  nomineeType: NomineeType;
}

export class CreateTrainingNomineeDto {
  @IsUUID('4')
  trainingDistribution: TrainingDistributionDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NomineeDto)
  employees: Array<NomineeDto>;
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

  @IsOptional()
  @IsString({ message: 'training nominee remarks must be string' })
  remarks: string;
}
