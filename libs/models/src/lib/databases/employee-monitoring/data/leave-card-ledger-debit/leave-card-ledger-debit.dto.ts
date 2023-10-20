import { DailyTimeRecord, LeaveApplication, LeaveCreditDeductions, PassSlip } from '@gscwd-api/models';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateLeaveCardLedgerDebitDto {
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  leaveApplicationId?: LeaveApplication;

  @IsOptional()
  passSlipId?: PassSlip;

  @IsOptional()
  dailyTimeRecordId?: DailyTimeRecord;

  @IsOptional()
  leaveCreditDeductionsId?: LeaveCreditDeductions;

  @IsNumber()
  debitValue: number;
}
