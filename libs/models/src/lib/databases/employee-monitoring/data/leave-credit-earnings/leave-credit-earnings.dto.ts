import { LeaveBenefits } from '@gscwd-api/models';

export class CreateLeaveCreditEarningsDto {
  id: string;
  employeeId: string;
  leaveBenefitsId: LeaveBenefits;
  creditDate: Date;
  creditValue: number;
}
