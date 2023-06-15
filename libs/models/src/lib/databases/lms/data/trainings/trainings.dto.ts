import { TrainingStatus } from '@gscwd-api/utils';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { IsArray, IsDateString, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { NomineeQualificationsDto } from '../nominee-qualifications';
import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDistributionDto } from '../training-distributions';

export class CreateTrainingDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsUUID('4')
  trainingType: TrainingType;

  @IsString({ message: 'training name must be a string' })
  @Length(1, 50, { message: 'training name must be between 1 to 50 characters' })
  lspName: string;

  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsString({ message: 'training start must be a string' })
  trainingStart: string;

  @IsString({ message: 'training end must be a string' })
  trainingEnd: string;

  @IsInt({ message: 'training number of hours must be a number' })
  numberOfHours: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseContentDto)
  courseContent: CourseContentDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => NomineeQualificationsDto)
  nomineeQualifications: NomineeQualificationsDto[];

  @IsDateString()
  deadlineForSubmission: Date;

  @IsString({ message: 'training invitation url must be a string' })
  invitationUrl: string;

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  trainingDistribution: CreateTrainingDistributionDto[];
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  @IsUUID('4')
  id: string;
}
