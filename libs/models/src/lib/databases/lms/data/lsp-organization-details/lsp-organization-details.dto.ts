import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { LspSubjectDto } from '../subject-matter-experts';
import { Type } from 'class-transformer';
import { LspSource } from '../lsp-sources';
import { CreateLspOrganizationAffiliationDto } from '../lsp-organization-affiliations';
import { CreateLspOrganizationAwardDto } from '../lsp-organization-awards';
import { CreateLspOrganizationCertificationDto } from '../lsp-organization-certifications';
import { CreateLspOrganizationCoachingDto } from '../lsp-organization-coachings';

export class CreateLspOrganizationDetailsDto {
  @IsString({ message: 'lsp organization details first name must be a string' })
  @Length(1, 200, { message: 'lsp organization details first name must be between 1 to 200 characters' })
  fullName: string;

  @IsString()
  @IsOptional()
  contactNumber: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString({ message: 'lsp organization details postal address must be a string' })
  @Length(1, 100, { message: 'lsp organization details postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => LspSubjectDto)
  expertise: LspSubjectDto[];

  @IsString({ message: 'lsp organization details photo url must be a string' })
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
  affiliations: CreateLspOrganizationAffiliationDto[];

  @IsArray()
  awards: CreateLspOrganizationAwardDto[];

  @IsArray()
  certifications: CreateLspOrganizationCertificationDto[];

  @IsArray()
  coaching: CreateLspOrganizationCoachingDto[];

  //   @IsArray()
  //   education: CreateLspIndividualEducationDto[];

  //   @IsArray()
  //   projects: CreateLspIndividualProjectDto[];

  //   @IsArray()
  //   trainings: CreateLspIndividualTrainingDto[];
}

export class UpdateLspOrganizationDetailsDto extends PartialType(CreateLspOrganizationDetailsDto) {
  @IsUUID('4')
  id: string;
}
