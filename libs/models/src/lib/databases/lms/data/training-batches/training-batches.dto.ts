import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsObject, IsUUID, ValidateNested } from 'class-validator';

export class TrainingDateDto {
  @IsNotEmpty()
  @IsDateString()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
  to: Date;
}

export class BatchEmployeeDto {
  @IsNotEmpty()
  @IsUUID('4')
  nomineeId: string;
}

export class CreateTrainingBatchDto {
  @IsNotEmpty()
  @IsInt()
  batchNumber: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDateDto)
  trainingDate: TrainingDateDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchEmployeeDto)
  employees: Array<BatchEmployeeDto>;
}

export class UpdateTrainingBatchDto extends PartialType(CreateTrainingBatchDto) {}
