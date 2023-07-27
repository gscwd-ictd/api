import { DailyTimeRecord, LeaveApplication, PassSlip } from '@gscwd-api/models';

export class CreateLeaveCardLedgerDebitDto {
  leaveApplicationId?: LeaveApplication;
  passSlipId?: PassSlip;
  dailyTimeRecordId?: DailyTimeRecord;
  debitValue: number;
}
