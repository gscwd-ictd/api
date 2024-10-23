import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { SubjectMatterExperts } from '../subject-matter-experts';
import { AffiliationDto } from '../lsp-affiliations';
import { AwardDto } from '../lsp-awards';
import { CertificationDto } from '../lsp-certifications';
import { CoachingDto } from '../lsp-coachings';
import { EducationDto } from '../lsp-educations';
import { ProjectDto } from '../lsp-projects';
import { TrainingDto } from '../lsp-trainings';

export class LspDetailsDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

/* insert learning service provider dto (type = individual & source = internal) */
export class CreateLspIndividualInternalDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: Array<SubjectMatterExperts>;

  @IsInt({ message: 'lsp experience number of years' })
  experience: number;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 1000, { message: 'lsp introduction must be between 1 to 1000 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => AffiliationDto)
  affiliations: Array<AffiliationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CoachingDto)
  coaching: Array<CoachingDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => ProjectDto)
  projects: Array<ProjectDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => TrainingDto)
  trainings: Array<TrainingDto>;
}

/* insert learning service provider dto (type = individual & source = external) */
export class CreateLspIndividualExternalDto {
  @IsNotEmpty()
  @IsString({ message: 'lsp first name must be a string' })
  @Length(1, 50, { message: 'lsp first name must be between 1 to 50 characters' })
  firstName: string;

  @IsNotEmpty()
  @IsString({ message: 'lsp middle name must be a string' })
  @Length(1, 50, { message: 'lsp middle name must be between 1 to 50 characters' })
  middleName: string;

  @IsNotEmpty()
  @IsString({ message: 'lsp last name must be a string' })
  @Length(1, 50, { message: 'lsp last name must be between 1 to 50 characters' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'lsp prefix name must be a string' })
  @Length(1, 20, { message: 'lsp prefix name must be between 1 to 20 characters' })
  prefixName: string;

  @IsOptional()
  @IsString({ message: 'lsp suffix name must be a string' })
  @Length(1, 20, { message: 'lsp suffix name must be between 1 to 20 characters' })
  suffixName: string;

  @IsOptional()
  @IsString({ message: 'lsp extension name must be a string' })
  @Length(1, 10, { message: 'lsp extension name must be between 1 to 10 characters' })
  extensionName: string;

  @IsString({ message: 'lsp sex must be a string' })
  @Length(1, 10, { message: 'lsp sex must be between 1 to 10 characters' })
  sex: string;

  @IsString({ message: 'lsp contact number must be a string' })
  @Length(1, 11, { message: 'lsp contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp postal address must be a string' })
  @Length(1, 100, { message: 'lsp postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @IsInt({ message: 'lsp experience number of years must be a number' })
  experience: number;

  @IsString({ message: 'lsp tin must be a string' })
  tin: string;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 1000, { message: 'lsp introduction must be between 1 to 1000 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: Array<SubjectMatterExperts>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => AffiliationDto)
  affiliations: Array<AffiliationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => AwardDto)
  awards: Array<AwardDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => CertificationDto)
  certifications: Array<CertificationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CoachingDto)
  coaching: Array<CoachingDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp education must be an array' })
  @Type(() => EducationDto)
  education: Array<EducationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => ProjectDto)
  projects: Array<ProjectDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => TrainingDto)
  trainings: Array<TrainingDto>;
}

/* insert learning service provider dto (type = organization & source = external) */
export class CreateLspOrganizationExternalDto {
  @IsNotEmpty({ message: 'lsp organization name should not empty' })
  @IsString({ message: 'lsp organization name must be a string' })
  @Length(1, 100, { message: 'lsp organization name must be between 1 to 100 characters' })
  organizationName: string;

  @IsString({ message: 'lsp contact number must be a string' })
  @Length(1, 11, { message: 'lsp contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp postal address must be a string' })
  @Length(1, 100, { message: 'lsp postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @IsInt({ message: 'lsp experience number of years must be a number' })
  experience: number;

  @IsString({ message: 'lsp photo url must be a string' })
  tin: string;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 1000, { message: 'lsp introduction must be between 1 to 1000 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: Array<SubjectMatterExperts>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => AffiliationDto)
  affiliations: Array<AffiliationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => AwardDto)
  awards: Array<AwardDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => CertificationDto)
  certifications: Array<CertificationDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CoachingDto)
  coaching: Array<CoachingDto>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => TrainingDto)
  trainings: Array<TrainingDto>;
}

/* edit learning service provider dto (type = individual & source = internal) */
export class UpdateLspIndividualInternalDto extends PartialType(CreateLspIndividualInternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

/* edit learning service provider dto (type = individual & source = external) */
export class UpdateLspIndividualExternalDto extends PartialType(CreateLspIndividualExternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

/* edit learning service provider dto (type = organization & source = external) */
export class UpdateLspOrganizationExternalDto extends PartialType(CreateLspOrganizationExternalDto) {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class UploadPhotoDto {
  @IsNotEmpty()
  @IsUUID('4')
  lspId: string;

  @IsNotEmpty()
  @IsString({ message: 'lsp id must be a string' })
  photoId: string;

  @IsNotEmpty()
  @IsString({ message: 'lsp photo url must be a string' })
  photoUrl: string;
}
