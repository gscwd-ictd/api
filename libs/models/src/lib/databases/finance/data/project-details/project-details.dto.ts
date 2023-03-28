import { PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, MaxLength } from 'class-validator';
import { BudgetDetails } from '../budget-details';

export class CreateProjectDetailsDto {
  @IsUUID(4, { message: 'budget details id is not valid' })
  budgetDetails: BudgetDetails;

  @IsString()
  @MaxLength(50, { message: 'Project name name is too long.' })
  projectName: string;

  @IsString()
  location: string;

  @IsString()
  subject: string;

  @IsString()
  workDescription: string;

  @IsInt()
  quantity: number;

  @IsInt()
  outputPerDay: number;
}

export class UpdateProjectDetailsDto extends PartialType(CreateProjectDetailsDto) {}
