import { LeaveBenefits } from '@gscwd-api/models';
import { IsDecimal, IsNotEmptyObject, IsNumber, IsString, IsUUID } from 'class-validator';

export class LeaveCreditDeductionsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  employeeId: string;

  leaveBenefitsId: LeaveBenefits;

  @IsNumber()
  debitValue: number;

  @IsString()
  remarks: string;
}
