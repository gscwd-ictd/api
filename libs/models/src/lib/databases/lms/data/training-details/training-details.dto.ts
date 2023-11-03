import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { TrainingDesign } from '../training-designs';
import { TrainingSource } from '../training-sources';
import { TrainingPreparationStatus, TrainingType } from '@gscwd-api/utils';
import { CreateTrainingTagDto } from '../training-tags';
import { CreateTrainingDistributionDto } from '../training-distributions';
import { TrainingRequirements } from '../training-requirements';
import { CreateTrainingLspDetailsDto } from '../training-lsp-details';

export class TrainingDetailsDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsEnum(TrainingType)
  @IsNotEmpty()
  trainingType: TrainingType;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: CourseContentDto[];

  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsDateString()
  trainingStart: Date;

  @IsDateString()
  trainingEnd: Date;

  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @IsDateString()
  deadlineForSubmission: Date;

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingRequirements)
  trainingRequirements: TrainingRequirements[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingLspDetailsDto)
  trainingLspDetails: Array<CreateTrainingLspDetailsDto>;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingTagDto)
  trainingTags: CreateTrainingTagDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  slotDistribution: CreateTrainingDistributionDto[];
}

export class CreateTrainingInternalDto extends TrainingDetailsDto {
  @IsUUID('4')
  trainingDesign: TrainingDesign;
}

export class CreateTrainingExternalDto extends TrainingDetailsDto {
  @IsNotEmpty()
  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsArray()
  bucketFiles: Array<string>;
}

export class UpdateTrainingInternalDto extends CreateTrainingInternalDto {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingPreparationStatus)
  trainingPreparationStatus: TrainingPreparationStatus;
}

export class UpdateTrainingExternalDto extends CreateTrainingExternalDto {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingPreparationStatus)
  trainingPreparationStatus: TrainingPreparationStatus;
}
