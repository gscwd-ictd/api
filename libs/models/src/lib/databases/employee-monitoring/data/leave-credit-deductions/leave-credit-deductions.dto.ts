import { LeaveBenefits } from '@gscwd-api/models';

export class LeaveCreditDeductionsDto {
  id: string;

  employeeId: string;

  leaveBenefitsId: LeaveBenefits;

  debitValue: number;

  remarks: string;
}
