import { DailyTimeRecord } from '../daily-time-record';
import { LeaveApplication } from '../leave-application';
import { LeaveCreditDeductions } from '../leave-credit-deductions';
import { PassSlip } from '../pass-slip';
import { DtrDeductionType } from '@gscwd-api/utils';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

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

  @IsOptional()
  dtrDeductionType?: DtrDeductionType;

  @IsOptional()
  @IsIn(['VL', 'SL'])
  leaveTypeCharged?: 'VL' | 'SL' | null;
}
