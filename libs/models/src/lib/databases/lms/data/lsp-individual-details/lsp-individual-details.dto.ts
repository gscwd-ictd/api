import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CreateLspIndividualAffiliationDto } from '../lsp-individual-affiliations';
import { CreateLspIndividualAwardDto } from '../lsp-individual-awards';
import { CreateLspIndividualCertificationDto } from '../lsp-individual-certifications';
import { CreateLspIndividualCoachingDto } from '../lsp-individual-coachings';
import { CreateLspIndividualEducationDto } from '../lsp-individual-educations';
import { CreateLspIndividualProjectDto } from '../lsp-individual-projects';
import { CreateLspIndividualTrainingDto } from '../lsp-individual-trainings';
import { LspSubjectDto } from '../subject-matter-experts';
import { Type } from 'class-transformer';
import { LspSource } from '../lsp-sources';

export class CreateLspIndividualDetailsDto {
  @IsUUID('all')
  @IsOptional()
  employeeId: string;

  @IsString({ message: 'lsp individual details first name must be a string' })
  @IsOptional()
  firstName: string;

  @IsString({ message: 'lsp individual details middle name must be a string' })
  @IsOptional()
  middleName: string;

  @IsString({ message: 'lsp individual details last name must be a string' })
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  contactNumber: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString({ message: 'lsp individual details postal address must be a string' })
  @Length(1, 100, { message: 'lsp individual details postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => LspSubjectDto)
  expertise: LspSubjectDto[];

  @IsString({ message: 'lsp individual details photo url must be a string' })
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
  lspSource: LspSource;

  @IsArray()
  affiliations: CreateLspIndividualAffiliationDto[];

  @IsArray()
  awards: CreateLspIndividualAwardDto[];

  @IsArray()
  certifications: CreateLspIndividualCertificationDto[];

  @IsArray()
  coaching: CreateLspIndividualCoachingDto[];

  @IsArray()
  education: CreateLspIndividualEducationDto[];

  @IsArray()
  projects: CreateLspIndividualProjectDto[];

  @IsArray()
  trainings: CreateLspIndividualTrainingDto[];
}

export class UpdateLspIndividualDetailsDto extends PartialType(CreateLspIndividualDetailsDto) {
  @IsUUID('4')
  id: string;
}
