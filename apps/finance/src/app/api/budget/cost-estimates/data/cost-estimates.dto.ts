import { CreateBudgetDetailsDto } from '@gscwd-api/models';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

export class CreateCostEstimateDto {
  @ValidateNested()
  @IsObject()
  @Type(() => CreateBudgetDetailsDto)
  budgetDetails: CreateBudgetDetailsDto;
}
