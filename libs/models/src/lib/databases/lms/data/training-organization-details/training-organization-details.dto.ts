import { IsArray, IsDateString, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { LspOrganizationDetails } from '../lsp-organization-details';
import { Type } from 'class-transformer';
import { CourseContentDto } from '../course-contents';
import { PartialType } from '@nestjs/swagger';
import { TrainingStatus } from '@gscwd-api/utils';

export class CreateTrainingOrganizationDetailsDto {
  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsUUID('4')
  trainingType: TrainingType;

  @IsUUID('4')
  lspOrganizationDetails: LspOrganizationDetails;

  @IsString({ message: 'training facilitator must be a string' })
  @Length(1, 100, { message: 'training facilitator must be between 1 to 100 characters' })
  facilitator: string;

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

  //   @ValidateNested({ each: true })
  //   @IsArray()
  //   @Type(() => CreateTrainingIndividualTagDto)
  //   nomineeQualifications: CreateTrainingIndividualTagDto[];

  @IsString({ message: 'training deadline for submission must be valid date' })
  deadlineForSubmission: Date;

  @IsString({ message: 'training invitation url must be a string' })
  invitationUrl: string;

  @IsInt({ message: 'training number of participants must be a number' })
  numberOfParticipants: number;

  //   @ValidateNested({ each: true })
  //   @IsArray()
  //   @Type(() => CreateTrainingIndividualDistributionDto)
  //   trainingDistribution: CreateTrainingIndividualDistributionDto[];
}

export class UpdateTrainingOrganizationDetailsDto extends PartialType(CreateTrainingOrganizationDetailsDto) {
  @IsUUID('4')
  id: string;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;
}
