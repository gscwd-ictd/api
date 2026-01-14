import { IsOptional } from 'class-validator';
import { LeaveAddBack } from '../leave-add-back/leave-add-back.entity';
import { LeaveBenefits } from '../leave-benefits';
import { LeaveCreditEarnings } from '../leave-credit-earnings';

export class CreateLeaveCardLedgerCreditDto {
  //id: string;
  @IsOptional()
  leaveAddBackId?: LeaveAddBack;

  @IsOptional()
  leaveCreditEarningId?: LeaveCreditEarnings;
}

export type LeaveBenefitsIds = {
  sickLeaveId: LeaveBenefits;
  vacationLeaveId: LeaveBenefits;
  specialPrivilegeLeaveId: LeaveBenefits;
  forcedLeaveId: LeaveBenefits;
  specialLeaveBenefitsId: LeaveBenefits;
  wellnessLeaveId: LeaveBenefits;
};
