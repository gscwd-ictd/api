import { OtherTrainingCategory, TrainingType } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { OtherTrainingParticipantDto } from '../other-training-participants';
import { Type } from 'class-transformer';
import { TrainingRequirementsDto } from '../training-requirements';

export class OtherTrainingDto {
  @IsNotEmpty()
  @IsString({ message: 'other training title must be a string' })
  @Length(1, 1000, { message: 'other training title must be between 1 to 1000 characters' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'other training description must be a string' })
  @Length(1, 1000, { message: 'other training description must be between 1 to 1000 characters' })
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dateFrom: Date;

  @IsNotEmpty()
  @IsDateString()
  dateTo: Date;

  @IsNotEmpty()
  @IsString({ message: 'other training location must be a string' })
  @Length(1, 1000, { message: 'other training location must be between 1 to 1000 characters' })
  location: string;

  @IsNotEmpty()
  @IsEnum(OtherTrainingCategory)
  category: OtherTrainingCategory;

  @IsNotEmpty()
  @IsEnum(TrainingType)
  type: TrainingType;

  @IsNotEmpty({ message: 'other training requirements should not be empty.' })
  @IsArray({ message: 'other training requirements must not be empty.' })
  @ValidateNested({ each: true })
  @Type(() => TrainingRequirementsDto)
  trainingRequirements: Array<TrainingRequirementsDto>;
}

export class CreateOtherTrainingDto extends PartialType(OtherTrainingDto) {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherTrainingParticipantDto)
  participants: Array<OtherTrainingParticipantDto>;
}

export class UpdateOtherTrainingDto extends PartialType(CreateOtherTrainingDto) {}
