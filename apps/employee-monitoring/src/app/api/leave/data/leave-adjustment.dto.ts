import { LeaveBenefits } from '@gscwd-api/models';

export class LeaveAdjustmentDto {
  category: string;
  leaveBenefitsId: LeaveBenefits;
  value: number;
  remarks?: string;
  employeeId: string;
}
