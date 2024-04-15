import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { NomineeType, TrainingNomineeStatus } from '@gscwd-api/utils';
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
  @IsNotEmpty()
  @IsUUID('4')
  trainingDistribution: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NomineeDto)
  employees: Array<NomineeDto>;
}

export class UpdateTrainingNomineeStatusDto {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: string;

  @IsNotEmpty()
  @IsEnum(TrainingNomineeStatus)
  status: TrainingNomineeStatus;

  @IsOptional()
  @IsString({ message: 'training nominee remarks must be string' })
  remarks: string;
}
