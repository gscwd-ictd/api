import { DailyTimeRecord, LeaveApplication, PassSlip } from '@gscwd-api/models';

export class CreateLeaveCardLedgerDebitDto {
  createdAt?: Date;
  leaveApplicationId?: LeaveApplication;
  passSlipId?: PassSlip;
  dailyTimeRecordId?: DailyTimeRecord;
  debitValue: number;
}
