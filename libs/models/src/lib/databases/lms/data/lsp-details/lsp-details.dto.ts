import { LspType } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CreateLspAffiliationDto } from '../lsp-affiliations';
import { CreateLspAwardDto } from '../lsp-awards';
import { CreateLspCertificationDto } from '../lsp-certifications';
import { CreateLspCoachingDto } from '../lsp-coachings';
import { CreateLspEducationDto } from '../lsp-educations';
import { CreateLspExperienceDto } from '../lsp-experiences';
import { CreateLspProjectDto } from '../lsp-projects';
import { CreateLspTrainingDto } from '../lsp-trainings';
import { LspSubjectDto } from '../subject-matter-experts';
import { Type } from 'class-transformer';

export class CreateLspDetailsDto {
  @IsOptional()
  employeeId: string;

  @IsString({ message: 'lsp details first name must be a string' })
  @Length(1, 100, { message: 'lsp details first name must be between 1 to 100 characters' })
  firstName: string;

  @IsString({ message: 'lsp details middle name must be a string' })
  @Length(1, 100, { message: 'venue details middle name must be between 1 to 100 characters' })
  middleName: string;

  @IsString({ message: 'lsp details last name must be a string' })
  @Length(1, 100, { message: 'lsp details last name must be between 1 to 100 characters' })
  lastName: string;

  @Length(1, 11, { message: 'lsp details contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp details postal address must be a string' })
  @Length(1, 100, { message: 'lsp details postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => LspSubjectDto)
  subjectMatterExpertise: LspSubjectDto[];

  @IsString({ message: 'lsp details educational attainment must be a string' })
  @Length(1, 100, { message: 'lsp details educational attainment must be between 1 to 100 characters' })
  educationalAttainment: string;

  @IsEnum(LspType)
  lspType: LspType;

  @IsArray()
  lspAffiliation: CreateLspAffiliationDto[];

  @IsArray()
  lspAward: CreateLspAwardDto[];

  @IsArray()
  lspCertification: CreateLspCertificationDto[];

  @IsArray()
  lspCoaching: CreateLspCoachingDto[];

  @IsArray()
  lspEducation: CreateLspEducationDto[];

  @IsArray()
  lspExperience: CreateLspExperienceDto[];

  @IsArray()
  lspProject: CreateLspProjectDto[];

  @IsArray()
  lspTraining: CreateLspTrainingDto[];
}

export class UpdateLspDetailsDto extends PartialType(CreateLspDetailsDto) {
  @IsUUID('4')
  id: string;
}
