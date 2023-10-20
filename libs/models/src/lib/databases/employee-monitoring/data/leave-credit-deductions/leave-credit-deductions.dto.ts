import { LeaveBenefits } from '@gscwd-api/models';
import { IsDecimal, IsNotEmptyObject, IsNumber, IsString, IsUUID } from 'class-validator';

export class LeaveCreditDeductionsDto {
  @IsUUID(4)
  id: string;

  @IsUUID(4)
  employeeId: string;

  leaveBenefitsId: LeaveBenefits;

  @IsNumber()
  debitValue: number;

  @IsString()
  remarks: string;
}
