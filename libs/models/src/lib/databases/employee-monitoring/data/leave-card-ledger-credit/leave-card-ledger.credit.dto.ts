import { LeaveAddBack } from '../leave-add-back/leave-add-back.entity';
import { LeaveBenefits } from '../leave-benefits';
import { LeaveCreditEarnings } from '../leave-credit-earnings';

export class CreateLeaveCardLedgerCreditDto {
  //id: string;
  leaveAddBackId?: LeaveAddBack;
  leaveCreditEarningId?: LeaveCreditEarnings;
}

export type LeaveBenefitsIds = {
  sickLeaveId: LeaveBenefits;
  vacationLeaveId: LeaveBenefits;
  specialPrivilegeLeaveId: LeaveBenefits;
  forcedLeaveId: LeaveBenefits;
  specialLeaveBenefitsId: LeaveBenefits;
};
