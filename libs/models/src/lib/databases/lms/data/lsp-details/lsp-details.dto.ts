import { LspType, SubjectMatterExpertise } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsInt, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CreateTrainingSourceDto } from '../training-sources';

export class CreateLspDetailsDto {
  @IsUUID()
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

  @IsInt({ message: 'lsp details contact number must be a number' })
  @Length(1, 11, { message: 'lsp details contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'lsp details name must be a string' })
  @Length(1, 100, { message: 'lsp details postal address must be between 1 to 100 characters' })
  postalAddress: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  subjectMatterExpertise: SubjectMatterExpertise;

  @IsString({ message: 'lsp details educational attainment must be a string' })
  @Length(1, 100, { message: 'lsp details educational attainment must be between 1 to 100 characters' })
  educationalAttainment: string;

  @IsEnum({ enum: LspType })
  lspType: LspType;
}

export class UpdateLspDetailsDto extends PartialType(CreateTrainingSourceDto) {}
