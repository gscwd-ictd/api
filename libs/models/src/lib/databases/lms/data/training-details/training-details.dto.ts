import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { TrainingDesignDto } from '../training-designs';
import { TrainingSourceDto } from '../training-sources';
import { TrainingType } from '@gscwd-api/utils';
import { TrainingTagDto } from '../training-tags';
import { SlotDistributionDto } from '../training-distributions';
import { TrainingRequirementsDto } from '../training-requirements';
import { TrainingLspDetailsDto } from '../training-lsp-details';
import { PartialType } from '@nestjs/swagger';

export class TrainingDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class CreateTrainingDetailsDto {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingSourceDto)
  source: TrainingSourceDto;

  @IsNotEmpty()
  @IsEnum(TrainingType)
  type: TrainingType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseContentDto)
  courseContent: Array<CourseContentDto>;

  @IsOptional()
  @IsString({ message: 'training location must be a string' })
  @Length(1, 500, { message: 'training location must be between 1 to 500 characters' })
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingRequirementsDto)
  trainingRequirements: Array<TrainingRequirementsDto>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingLspDetailsDto)
  trainingLspDetails: Array<TrainingLspDetailsDto>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainingTagDto)
  trainingTags: Array<TrainingTagDto>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDistributionDto)
  slotDistribution: Array<SlotDistributionDto>;
}

export class CreateTrainingInternalDto extends CreateTrainingDetailsDto {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TrainingDesignDto)
  trainingDesign: TrainingDesignDto;
}

export class CreateTrainingExternalDto extends CreateTrainingDetailsDto {
  @IsNotEmpty()
  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;
}

export class UpdateTrainingInternalDto extends PartialType(CreateTrainingInternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class UpdateTrainingExternalDto extends PartialType(CreateTrainingExternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
