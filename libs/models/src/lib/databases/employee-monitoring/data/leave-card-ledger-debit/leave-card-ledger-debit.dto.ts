import { DailyTimeRecord, LeaveApplication, LeaveCreditDeductions, PassSlip } from '@gscwd-api/models';

export class CreateLeaveCardLedgerDebitDto {
  createdAt?: Date;
  leaveApplicationId?: LeaveApplication;
  passSlipId?: PassSlip;
  dailyTimeRecordId?: DailyTimeRecord;
  leaveCreditDeductionsId?: LeaveCreditDeductions;
  debitValue: number;
}
