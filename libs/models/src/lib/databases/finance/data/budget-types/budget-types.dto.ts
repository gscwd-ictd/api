import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateBudgetTypeDto {
  @IsString({ message: 'budget type name must be a string' })
  @Length(1, 60, { message: 'budget type name must be between 1 to 60 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'unit description must be a string' })
  description: string;
}

export class UpdateBudgetTypeDto extends PartialType(CreateBudgetTypeDto) {}
