import { LeaveAddBack } from '../leave-add-back/leave-add-back.entity';
import { LeaveCreditEarnings } from '../leave-credit-earnings';

export class LeaveCardLedgerCreditDto {
  id: string;
  leaveAddBackId: LeaveAddBack;
  leaveCreditEarningId: LeaveCreditEarnings;
}
