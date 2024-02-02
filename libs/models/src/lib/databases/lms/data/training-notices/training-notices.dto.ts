import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { TrainingSourceDto } from '../training-sources';
import { TrainingType } from '@gscwd-api/utils';
import { TrainingDesignDto } from '../training-designs';
import { CourseContentDto } from '../course-contents';
import { TrainingRequirementsDto } from '../training-requirements';
import { TrainingLspDetailsDto } from '../training-lsp-details';
import { TrainingTagDto } from '../training-tags';
import { SlotDistributionDto } from '../training-distributions';

export class TrainingNoticeInternalDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingSourceDto)
  source: TrainingSourceDto;

  @IsNotEmpty()
  @IsEnum(TrainingType)
  type: TrainingType;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDesignDto)
  trainingDesign: TrainingDesignDto;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseContentDto)
  courseContent: Array<CourseContentDto>;

  @IsNotEmpty()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 500, { message: 'training location must be between 1 to 500 characters' })
  location: string;

  @IsNotEmpty()
  @IsDateString()
  trainingStart: Date;

  @IsNotEmpty()
  @IsDateString()
  trainingEnd: Date;

  @IsNotEmpty()
  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @IsNotEmpty()
  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingRequirementsDto)
  trainingRequirements: Array<TrainingRequirementsDto>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingLspDetailsDto)
  trainingLspDetails: Array<TrainingLspDetailsDto>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingTagDto)
  trainingTags: Array<TrainingTagDto>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDistributionDto)
  slotDistribution: Array<SlotDistributionDto>;
}

export class TrainingNoticeExternalDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingSourceDto)
  source: TrainingSourceDto;

  @IsNotEmpty()
  @IsEnum(TrainingType)
  type: TrainingType;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseContentDto)
  courseContent: Array<CourseContentDto>;

  @IsNotEmpty()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 500, { message: 'training location must be between 1 to 500 characters' })
  location: string;

  @IsNotEmpty()
  @IsDateString()
  trainingStart: Date;

  @IsNotEmpty()
  @IsDateString()
  trainingEnd: Date;

  @IsNotEmpty()
  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @IsNotEmpty()
  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingRequirementsDto)
  trainingRequirements: Array<TrainingRequirementsDto>;

  @IsNotEmpty()
  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @ArrayNotEmpty()
  @IsArray()
  bucketFiles: Array<string>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingLspDetailsDto)
  trainingLspDetails: Array<TrainingLspDetailsDto>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingTagDto)
  trainingTags: Array<TrainingTagDto>;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDistributionDto)
  slotDistribution: Array<SlotDistributionDto>;
}
