import { TrainingStatus } from '@gscwd-api/utils';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { IsArray, IsDateString, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { PartialType } from '@nestjs/swagger';
import { TrainingDistributionDto } from '../training-distributions';
import { TrainingTag, TrainingTagDto } from '../training-tags';
import { PostTrainingRequirementsDto } from '../post-training-requirements';

export class CreateTrainingDetailsDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsUUID('4')
  trainingType: TrainingType;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingTagDto)
  trainingTags: TrainingTag[];

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @IsDateString()
  trainingStart: Date;

  @IsDateString()
  trainingEnd: Date;

  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsUUID('4')
  lspDetails: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: CourseContentDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TrainingDistributionDto)
  slotDistribution: TrainingDistributionDto[];

  @IsString({ message: 'training deadline for submission must be valid date' })
  deadlineForSubmission: Date;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PostTrainingRequirementsDto)
  postTrainingRequirements: PostTrainingRequirementsDto[];

  @IsString({ message: 'training invitation url must be a string' })
  invitationUrl: string;
}

export class UpdateTrainingDetailsDto extends PartialType(CreateTrainingDetailsDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;
}
