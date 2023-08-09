import { TrainingStatus } from '@gscwd-api/utils';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { IsArray, IsDateString, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDistributionDto } from '../training-distributions';
import { CreateTrainingTagDto } from '../training-tags';
import { PostTrainingRequirementsDto } from '../post-training-requirements';
import { CreateRecommendedEmployeeDto } from '../training-recommended-employees';

export class CreateTrainingDetailsDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsUUID('4')
  trainingType: TrainingType;

  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsDateString()
  trainingStart: Date;

  @IsDateString()
  trainingEnd: Date;

  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: CourseContentDto[];

  @IsString({ message: 'training deadline for submission must be valid date' })
  deadlineForSubmission: Date;

  @IsString({ message: 'training invitation url must be a string' })
  invitationUrl: string;

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @IsUUID('4')
  lspDetails: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingTagDto)
  trainingTags: CreateTrainingTagDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateRecommendedEmployeeDto)
  recommendedEmployee: CreateRecommendedEmployeeDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  trainingDistribution: CreateTrainingDistributionDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PostTrainingRequirementsDto)
  postTrainingRequirements: PostTrainingRequirementsDto[];
}

export class UpdateTrainingDetailsDto extends PartialType(CreateTrainingDetailsDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;
}
