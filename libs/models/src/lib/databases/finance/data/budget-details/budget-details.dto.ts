import { PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BudgetType } from '../budget-types';
import { GeneralLedgerAccount } from '../general-ledger-accounts';

export class CreateBudgetDetailsDto {
  @IsUUID(4, { message: 'budget type id is not valid' })
  budgetType: BudgetType;

  @IsUUID(4, { message: 'general ledger account id is not valid' })
  generalLedgerAccount: GeneralLedgerAccount;
}

export class UpdateBudgetDetailsDto extends PartialType(CreateBudgetDetailsDto) {}
