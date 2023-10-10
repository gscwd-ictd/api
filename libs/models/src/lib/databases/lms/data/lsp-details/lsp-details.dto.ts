import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { SubjectMatterExperts } from '../subject-matter-experts';
import { CreateLspAffiliationDto } from '../lsp-affiliations';
import { CreateLspAwardDto } from '../lsp-awards';
import { CreateLspCertificationDto } from '../lsp-certifications';
import { CreateLspCoachingDto } from '../lsp-coachings';
import { CreateLspEducationDto } from '../lsp-educations';
import { CreateLspProjectDto } from '../lsp-projects';
import { CreateLspTrainingDto } from '../lsp-trainings';
import { PartialType } from '@nestjs/swagger';

// create lsp (type = individual , source = internal)
export class CreateLspIndividualInternalDto {
  @IsUUID('all')
  @IsNotEmpty()
  employeeId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: SubjectMatterExperts[];

  @IsInt({ message: 'lsp experience number of years' })
  experience: number;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => CreateLspAffiliationDto)
  affiliations: CreateLspAffiliationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CreateLspCoachingDto)
  coaching: CreateLspCoachingDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => CreateLspProjectDto)
  projects: CreateLspProjectDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => CreateLspTrainingDto)
  trainings: CreateLspTrainingDto[];
}

// create lsp (type = individual , source = external)
export class CreateLspIndividualExternalDto {
  @IsString({ message: 'lsp first name must be a string' })
  @Length(1, 50, { message: 'lsp first name must be between 1 to 50 characters' })
  @IsNotEmpty()
  firstName: string;

  @IsString({ message: 'lsp middle name must be a string' })
  @Length(1, 50, { message: 'lsp middle name must be between 1 to 50 characters' })
  @IsNotEmpty()
  middleName: string;

  @IsString({ message: 'lsp last name must be a string' })
  @Length(1, 50, { message: 'lsp last name must be between 1 to 50 characters' })
  @IsNotEmpty()
  lastName: string;

  @IsString({ message: 'lsp prefix name must be a string' })
  @Length(1, 20, { message: 'lsp prefix name must be between 1 to 20 characters' })
  prefixName: string;

  @IsString({ message: 'lsp suffix name must be a string' })
  @Length(1, 20, { message: 'lsp suffix name must be between 1 to 20 characters' })
  suffixName: string;

  @IsString({ message: 'lsp extension name must be a string' })
  @Length(1, 10, { message: 'lsp extension name must be between 1 to 10 characters' })
  extensionName: string;

  @IsString({ message: 'lsp contact number must be a string' })
  @Length(1, 11, { message: 'lsp contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp postal address must be a string' })
  @Length(1, 100, { message: 'lsp postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: SubjectMatterExperts[];

  @IsString({ message: 'lsp photo url must be a string' })
  photoUrl: string;

  @IsInt({ message: 'lsp experience number of years must be a number' })
  experience: number;

  @IsString({ message: 'lsp photo url must be a string' })
  tin: string;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => CreateLspAffiliationDto)
  affiliations: CreateLspAffiliationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => CreateLspAwardDto)
  awards: CreateLspAwardDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => CreateLspCertificationDto)
  certifications: CreateLspCertificationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CreateLspCoachingDto)
  coaching: CreateLspCoachingDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp education must be an array' })
  @Type(() => CreateLspEducationDto)
  education: CreateLspEducationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => CreateLspProjectDto)
  projects: CreateLspProjectDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => CreateLspTrainingDto)
  trainings: CreateLspTrainingDto[];
}

// create lsp (type = organization, source = external)
export class CreateLspOrganizationExternalDto {
  @IsString({ message: 'lsp organization name must be a string' })
  @Length(1, 100, { message: 'lsp organization name must be between 1 to 100 characters' })
  @IsNotEmpty()
  organizationName: string;

  @IsString({ message: 'lsp contact number must be a string' })
  @Length(1, 11, { message: 'lsp contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp postal address must be a string' })
  @Length(1, 100, { message: 'lsp postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: SubjectMatterExperts[];

  @IsString({ message: 'lsp photo url must be a string' })
  photoUrl: string;

  @IsInt({ message: 'lsp experience number of years must be a number' })
  experience: number;

  @IsString({ message: 'lsp photo url must be a string' })
  tin: string;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => CreateLspAffiliationDto)
  affiliations: CreateLspAffiliationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => CreateLspAwardDto)
  awards: CreateLspAwardDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => CreateLspCertificationDto)
  certifications: CreateLspCertificationDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => CreateLspCoachingDto)
  coaching: CreateLspCoachingDto[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => CreateLspTrainingDto)
  trainings: CreateLspTrainingDto[];
}

// update lsp (type = individual , source = internal)
export class UpdateLspIndividualInternalDto extends PartialType(CreateLspIndividualInternalDto) {
  @IsUUID()
  id: string;
}

// update lsp (type = individual , source = external)
export class UpdateLspIndividualExternalDto extends PartialType(CreateLspIndividualExternalDto) {
  @IsUUID()
  id: string;
}

// update lsp (type = organization, source = external)
export class UpdateLspOrganizationExternalDto extends PartialType(CreateLspOrganizationExternalDto) {
  @IsUUID()
  id: string;
}
