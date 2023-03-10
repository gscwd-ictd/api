import { PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BudgetType } from '../budget-types';

export class CreateBudgetDetailDto {
  @IsUUID(4, { message: 'budget type id is not valid' })
  budgetType: BudgetType;
}

export class UpdateBudgetDetailDto extends PartialType(CreateBudgetDetailDto) {}
