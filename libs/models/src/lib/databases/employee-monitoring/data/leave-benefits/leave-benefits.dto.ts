import { LeaveTypes, CreditDistribution } from '@gscwd-api/utils';

export class LeaveBenefitsDto {
  id: string;
  leaveName: string;
  leaveType: LeaveTypes;
  accumulatedCredits: number;
  creditDistribution: CreditDistribution;
  monitizeable: boolean;
  canBeCarriedOver: boolean;
}
