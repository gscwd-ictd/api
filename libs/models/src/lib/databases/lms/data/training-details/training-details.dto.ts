import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { TrainingDesign } from '../training-designs';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '@gscwd-api/utils';
import { CreateTrainingTagDto } from '../training-tags';
import { CreateTrainingDistributionDto } from '../training-distributions';
import { TrainingRequirements } from '../training-requirements';
import { CreateTrainingLspDetailsDto } from '../training-lsp-details';
import { PartialType } from '@nestjs/swagger';

export class TrainingDetailsDto {
  @IsUUID('4')
  @IsNotEmpty()
  trainingSource: TrainingSource;

  @IsEnum(TrainingType)
  @IsNotEmpty()
  trainingType: TrainingType;

  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: CourseContentDto[];

  @IsOptional()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsOptional()
  @IsDateString()
  trainingStart: Date;

  @IsOptional()
  @IsDateString()
  trainingEnd: Date;

  @IsOptional()
  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @IsOptional()
  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @IsArray()
  @Type(() => TrainingRequirements)
  trainingRequirements: TrainingRequirements[];

  @IsArray()
  @Type(() => CreateTrainingLspDetailsDto)
  trainingLspDetails: Array<CreateTrainingLspDetailsDto>;

  @IsArray()
  @Type(() => CreateTrainingTagDto)
  trainingTags: CreateTrainingTagDto[];

  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  slotDistribution: CreateTrainingDistributionDto[];
}

export class CreateTrainingInternalDto extends PartialType(TrainingDetailsDto) {
  @IsUUID('4')
  trainingDesign: TrainingDesign;
}

export class CreateTrainingExternalDto extends PartialType(TrainingDetailsDto) {
  @IsNotEmpty()
  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsOptional()
  @IsArray()
  bucketFiles: Array<string>;

  @IsOptional()
  @IsDateString()
  deadlineForSubmission: Date;
}

export class UpdateTrainingInternalDto extends PartialType(CreateTrainingInternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class UpdateTrainingExternalDto extends PartialType(CreateTrainingExternalDto) {
  @IsUUID('4')
  id: string;
}

export class SendTrainingInternalDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsEnum(TrainingType)
  @IsNotEmpty()
  trainingType: TrainingType;

  @IsNotEmpty()
  @IsUUID('4')
  trainingDesign: TrainingDesign;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: Array<CourseContentDto>;

  @IsNotEmpty()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
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
  @IsDateString()
  deadlineForSubmission: Date;

  @IsNotEmpty()
  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingRequirements)
  trainingRequirements: Array<TrainingRequirements>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingLspDetailsDto)
  trainingLspDetails: Array<CreateTrainingLspDetailsDto>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingTagDto)
  trainingTags: Array<CreateTrainingTagDto>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  slotDistribution: Array<CreateTrainingDistributionDto>;
}

export class SendTrainingExternalDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsNotEmpty()
  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: Array<CourseContentDto>;

  @IsNotEmpty()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
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
  @IsDateString()
  deadlineForSubmission: Date;

  @IsNotEmpty()
  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingRequirements)
  trainingRequirements: Array<TrainingRequirements>;

  @IsNotEmpty()
  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsArray()
  bucketFiles: Array<string>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingLspDetailsDto)
  trainingLspDetails: Array<CreateTrainingLspDetailsDto>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingTagDto)
  trainingTags: Array<CreateTrainingTagDto>;

  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  slotDistribution: Array<CreateTrainingDistributionDto>;
}
