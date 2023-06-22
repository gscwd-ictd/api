import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CreateLspIndividualAffiliationDto } from '../lsp-individual-affiliations';
import { CreateLspIndividualAwardDto } from '../lsp-individual-awards';
import { CreateLspCertificationDto } from '../lsp-certifications';
import { CreateLspCoachingDto } from '../lsp-coachings';
import { CreateLspEducationDto } from '../lsp-educations';
import { CreateLspProjectDto } from '../lsp-projects';
import { CreateLspTrainingDto } from '../lsp-trainings';
import { LspSubjectDto } from '../subject-matter-experts';
import { Type } from 'class-transformer';
import { TrainingSource } from '../training-sources';

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

  @IsString()
  @IsOptional()
  contactNumber: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString({ message: 'lsp details postal address must be a string' })
  @Length(1, 100, { message: 'lsp details postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => LspSubjectDto)
  expertise: LspSubjectDto[];

  @IsString({ message: 'lsp details photo url must be a string' })
  photoUrl: string;

  @IsNumber()
  experience: number;

  @IsString()
  @IsOptional()
  tin: string;

  @IsString()
  @IsOptional()
  introduction: string;

  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsArray()
  affiliations: CreateLspIndividualAffiliationDto[];

  @IsArray()
  awards: CreateLspIndividualAwardDto[];

  @IsArray()
  certifications: CreateLspCertificationDto[];

  @IsArray()
  coaching: CreateLspCoachingDto[];

  @IsArray()
  education: CreateLspEducationDto[];

  @IsArray()
  projects: CreateLspProjectDto[];

  @IsArray()
  trainings: CreateLspTrainingDto[];
}

export class UpdateLspDetailsDto extends PartialType(CreateLspDetailsDto) {
  @IsUUID('4')
  id: string;
}
