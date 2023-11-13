import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Affiliations, Awards, Certifications, Coaching, Education, Projects, SubjectMatterExperts, Trainings } from '@gscwd-api/utils';

// create lsp (type = individual , source = internal)
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
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => Affiliations)
  affiliations: Array<Affiliations>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => Coaching)
  coaching: Array<Coaching>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => Projects)
  projects: Array<Projects>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => Trainings)
  trainings: Array<Trainings>;
}

// create lsp (type = individual , source = external)
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

  @IsString({ message: 'lsp prefix name must be a string' })
  @Length(1, 20, { message: 'lsp prefix name must be between 1 to 20 characters' })
  prefixName: string;

  @IsString({ message: 'lsp suffix name must be a string' })
  @Length(1, 20, { message: 'lsp suffix name must be between 1 to 20 characters' })
  suffixName: string;

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

  @IsString({ message: 'lsp photo url must be a string' })
  tin: string;

  @IsString({ message: 'lsp introduction must be a string' })
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @IsString({ message: 'lsp photo url must be a string' })
  photoUrl: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: Array<SubjectMatterExperts>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => Affiliations)
  affiliations: Array<Affiliations>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => Awards)
  awards: Array<Awards>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => Certifications)
  certifications: Array<Certifications>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => Coaching)
  coaching: Array<Coaching>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp education must be an array' })
  @Type(() => Education)
  education: Array<Education>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp projects must be an array' })
  @Type(() => Projects)
  projects: Array<Projects>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => Trainings)
  trainings: Array<Trainings>;
}

// create lsp (type = organization, source = external)
export class CreateLspOrganizationExternalDto {
  @IsNotEmpty()
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
  @Length(1, 250, { message: 'lsp introduction must be between 1 to 250 characters' })
  introduction: string;

  @IsString({ message: 'lsp photo url must be a string' })
  photoUrl: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SubjectMatterExperts)
  expertise: Array<SubjectMatterExperts>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp affiliations must be an array' })
  @Type(() => Affiliations)
  affiliations: Array<Affiliations>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp awards must be an array' })
  @Type(() => Awards)
  awards: Array<Awards>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp certifications must be an array' })
  @Type(() => Certifications)
  certifications: Array<Certifications>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp coaching must be an array' })
  @Type(() => Coaching)
  coaching: Array<Coaching>;

  @ValidateNested({ each: true })
  @IsArray({ message: 'lsp trainings must be an array' })
  @Type(() => Trainings)
  trainings: Array<Trainings>;
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
