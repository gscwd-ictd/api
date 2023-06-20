import { TrainingStatus } from '@gscwd-api/utils';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { IsArray, IsDate, IsDateString, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { NomineeQualificationsDto } from '../nominee-qualifications';
import { PartialType } from '@nestjs/swagger';
import { CreateTrainingDistributionDto } from '../training-distributions';
import { LspDetails } from '../lsp-details';

export class CreateTrainingDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsUUID('4')
  trainingType: TrainingType;

  @IsUUID('4')
  lspDetails: LspDetails;

  @IsString({ message: 'training location must be a string' })
  @Length(1, 100, { message: 'training location must be between 1 to 100 characters' })
  location: string;

  @IsString({ message: 'training course title must be a string' })
  @Length(1, 100, { message: 'training course title must be between 1 to 100 characters' })
  courseTitle: string;

  @IsDate({ message: 'training date start must be valid date' })
  trainingStart: Date;

  @IsDate({ message: 'training date end must be valid date' })
  trainingEnd: Date;

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

  @IsDate({ message: 'training deadline for submission must be valid date' })
  deadlineForSubmission: Date;

  @IsString({ message: 'training invitation url must be a string' })
  invitationUrl: string;

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateTrainingDistributionDto)
  trainingDistribution: CreateTrainingDistributionDto[];
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;
}
